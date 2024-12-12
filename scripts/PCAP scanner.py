from scapy.all import sniff, IP, TCP, UDP, ICMP, Raw
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv
import os
import json
import time
from datetime import datetime
import threading
import logging
import socket
import re
import psutil
from queue import Queue, Empty
from collections import defaultdict

class NetworkMonitor:
    def __init__(self):
        # Set up paths
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.cache_dir = os.path.join(self.script_dir, "cache")
        self.sensor_id_file = os.path.join(self.cache_dir, "sensor_id.json")

        # Load environment variables
        parent_directory = os.path.join(self.script_dir,'..', 'projectVD')
        env_path = os.path.join(parent_directory, '.env.local')
        load_dotenv(env_path)

        # Get sensor ID from cache
        self.sensor_id = self._get_sensor_id()
        if not self.sensor_id:
            raise Exception("Could not retrieve sensor ID from cache")

        # MongoDB setup
        MONGODB_URI = os.getenv('MONGODB_URI')
        if not MONGODB_URI:
            raise Exception("MONGODB_URI not found in environment variables.")
        
        self.client = MongoClient(MONGODB_URI)
        self.db = self.client['projectv']
        self.traffic_collection = self.db['network_traffic']
        self.threats_collection = self.db['network_threats']

        # Initialize monitoring state
        self.packet_queue = Queue()
        self.active = True
        self.hourly_stats = self._create_hourly_stats()
        self.unique_ips = set()
        
        # Connection tracking for threat detection
        self.connection_tracker = defaultdict(lambda: {
            'count': 0,
            'last_seen': 0,
            'bytes': 0
        })
        
        # Get local IP addresses
        self.local_ips = self._get_local_ips()
        
        # Initialize threads
        self.analyzer_thread = threading.Thread(target=self._analyze_packets)
        self.stats_thread = threading.Thread(target=self._update_stats)

        # Configure logging
        logging.basicConfig(
            filename='network_monitor.log',
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )

        # Threat detection thresholds
        self.thresholds = {
            'syn_flood': 100,
            'connection_rate': 50,
            'packet_size': 9000,
            'icmp_flood': 50,
            'port_scan': 20
        }

    def _get_sensor_id(self):
        """Retrieve sensor ID from cache file"""
        try:
            with open(self.sensor_id_file, 'r') as file:
                cache_data = json.load(file)
                return cache_data.get('sensor_id')
        except Exception as e:
            logging.error(f"Error reading sensor ID from cache: {str(e)}")
            return None

    def _create_hourly_stats(self):
        """Initialize hourly statistics structure"""
        return {
            'bytesIn': 0,
            'bytesOut': 0,
            'packetsIn': 0,
            'packetsOut': 0,
            'protocols': {
                'TCP': 0,
                'UDP': 0,
                'ICMP': 0,
                'OTHER': 0
            }
        }

    def _get_local_ips(self):
        """Get all local IP addresses"""
        local_ips = set()
        try:
            for interface, addrs in psutil.net_if_addrs().items():
                for addr in addrs:
                    if addr.family == socket.AF_INET:
                        local_ips.add(addr.address)
            local_ips.add('127.0.0.1')
        except Exception as e:
            logging.error(f"Error getting local IPs: {str(e)}")
            local_ips.add('127.0.0.1')
        return local_ips

    def _update_traffic_stats(self):
        """Update traffic statistics in MongoDB"""
        current_hour = datetime.now().hour
        
        traffic_doc = {
            'sensorId': self.sensor_id,
            'timestamp': datetime.now(),
            'trafficStats': {
                'hourly': {
                    str(current_hour): {
                        'bytesIn': self.hourly_stats['bytesIn'],
                        'bytesOut': self.hourly_stats['bytesOut'],
                        'packetsIn': self.hourly_stats['packetsIn'],
                        'packetsOut': self.hourly_stats['packetsOut'],
                        'uniqueIPs': list(self.unique_ips),
                        'protocols': self.hourly_stats['protocols']
                    }
                },
                'daily': {
                    'totalBytes': self.hourly_stats['bytesIn'] + self.hourly_stats['bytesOut'],
                    'totalPackets': self.hourly_stats['packetsIn'] + self.hourly_stats['packetsOut'],
                    'avgBytesPerSecond': (self.hourly_stats['bytesIn'] + self.hourly_stats['bytesOut']) / 3600,
                    'avgPacketsPerSecond': (self.hourly_stats['packetsIn'] + self.hourly_stats['packetsOut']) / 3600
                }
            }
        }

        try:
            self.traffic_collection.update_one(
                {'sensorId': self.sensor_id, 
                 'timestamp': {'$gte': datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)}},
                {'$set': {
                    f'trafficStats.hourly.{current_hour}': traffic_doc['trafficStats']['hourly'][str(current_hour)],
                    'trafficStats.daily': traffic_doc['trafficStats']['daily']
                }},
                upsert=True
            )
            logging.info("Traffic stats updated successfully")
        except Exception as e:
            logging.error(f"Error updating traffic stats: {str(e)}")

    def _store_threat(self, threat_data):
        """Store detected threat in MongoDB"""
        threat_doc = {
            'sensorId': self.sensor_id,
            'timestamp': datetime.now(),
            'threatType': threat_data['type'],
            'sourceIP': threat_data['source_ip'],
            'destinationIP': threat_data['destination_ip'],
            'protocol': threat_data.get('protocol', 'UNKNOWN'),
            'port': threat_data.get('port', 0),
            'severity': threat_data.get('severity', 'MEDIUM'),
            'details': {
                'packetSize': threat_data.get('packet_size', 0),
                'flags': threat_data.get('flags', ''),
                'payload': threat_data.get('payload', ''),
                'matchedSignature': threat_data.get('signature', '')
            },
            'resolved': False
        }

        try:
            self.threats_collection.insert_one(threat_doc)
            logging.info(f"Stored threat: {threat_data['type']} from {threat_data['source_ip']}")
        except Exception as e:
            logging.error(f"Error storing threat: {str(e)}")

    def _detect_threats(self, packet):
        """Detect various types of threats from packet data"""
        if IP not in packet:
            return
        
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
        current_time = time.time()
        
        # Update connection tracker
        conn_key = f"{src_ip}:{dst_ip}"
        conn_data = self.connection_tracker[conn_key]
        conn_data['count'] += 1
        conn_data['bytes'] += len(packet)
        
        # Check for various threats
        if TCP in packet:
            if packet[TCP].flags & 0x02:  # SYN flag
                if self._detect_syn_flood(src_ip, current_time):
                    self._store_threat({
                        'type': 'SYN_FLOOD',
                        'source_ip': src_ip,
                        'destination_ip': dst_ip,
                        'protocol': 'TCP',
                        'port': packet[TCP].dport,
                        'severity': 'HIGH'
                    })
            
            if Raw in packet:
                payload = bytes(packet[Raw].load)
                if self._detect_malicious_payload(payload):
                    self._store_threat({
                        'type': 'MALICIOUS_PAYLOAD',
                        'source_ip': src_ip,
                        'destination_ip': dst_ip,
                        'protocol': 'TCP',
                        'port': packet[TCP].dport,
                        'payload': payload[:1000].decode(errors='ignore'),
                        'severity': 'HIGH'
                    })

        elif ICMP in packet:
            if self._detect_icmp_flood(src_ip, current_time):
                self._store_threat({
                    'type': 'ICMP_FLOOD',
                    'source_ip': src_ip,
                    'destination_ip': dst_ip,
                    'protocol': 'ICMP',
                    'severity': 'MEDIUM'
                })

    def _detect_syn_flood(self, ip, current_time):
        """Detect potential SYN flood attacks"""
        conn_data = self.connection_tracker[ip]
        if current_time - conn_data['last_seen'] <= 1:  # Within 1 second
            return conn_data['count'] > self.thresholds['syn_flood']
        conn_data['count'] = 1
        conn_data['last_seen'] = current_time
        return False

    def _detect_malicious_payload(self, payload):
        """Detect potentially malicious payloads"""
        suspicious_patterns = [
            rb'(?i)SELECT.*FROM',
            rb'(?i)UNION.*SELECT',
            rb'(?i)<script>',
            rb'(?i)eval\(',
            rb'(?i)EXEC(\s|\+)+(x|X)',
            rb'(/\*|\*/|\|\||&&)',
        ]
        
        try:
            return any(re.search(pattern, payload) for pattern in suspicious_patterns)
        except Exception as e:
            logging.error(f"Error in payload analysis: {str(e)}")
            return False

    def _detect_icmp_flood(self, ip, current_time):
        """Detect ICMP flood attacks"""
        conn_data = self.connection_tracker[ip]
        if current_time - conn_data['last_seen'] <= 1:
            return conn_data['count'] > self.thresholds['icmp_flood']
        conn_data['count'] = 1
        conn_data['last_seen'] = current_time
        return False

    def _process_packet(self, packet):
        """Process and analyze individual packets"""
        if IP in packet:
            # Update basic statistics
            is_incoming = packet[IP].dst in self.local_ips
            packet_length = len(packet)
            
            if is_incoming:
                self.hourly_stats['packetsIn'] += 1
                self.hourly_stats['bytesIn'] += packet_length
            else:
                self.hourly_stats['packetsOut'] += 1
                self.hourly_stats['bytesOut'] += packet_length

            # Track unique IPs
            self.unique_ips.add(packet[IP].src)
            self.unique_ips.add(packet[IP].dst)

            # Update protocol statistics
            if TCP in packet:
                self.hourly_stats['protocols']['TCP'] += 1
            elif UDP in packet:
                self.hourly_stats['protocols']['UDP'] += 1
            elif ICMP in packet:
                self.hourly_stats['protocols']['ICMP'] += 1
            else:
                self.hourly_stats['protocols']['OTHER'] += 1

            # Perform threat detection
            self._detect_threats(packet)

    def _packet_callback(self, packet):
        """Callback for packet capture"""
        if self.active:
            self.packet_queue.put(packet)

    def _analyze_packets(self):
        """Main packet analysis loop"""
        while self.active:
            try:
                packet = self.packet_queue.get(timeout=1)
                self._process_packet(packet)
            except Empty:
                continue
            except Exception as e:
                logging.error(f"Error processing packet: {str(e)}")

    def _update_stats(self):
        """Periodic statistics update loop"""
        while self.active:
            time.sleep(60)  # Update every minute
            try:
                self._update_traffic_stats()
            except Exception as e:
                logging.error(f"Error updating stats: {str(e)}")

    def start_monitoring(self):
        """Start the network monitoring"""
        print(f"Starting network monitoring for sensor: {self.sensor_id}")
        self.analyzer_thread.start()
        self.stats_thread.start()
        
        try:
            sniff(prn=self._packet_callback, store=0)
        except KeyboardInterrupt:
            self.stop_monitoring()
        except Exception as e:
            logging.error(f"Error in monitoring: {str(e)}")
            self.stop_monitoring()

    def stop_monitoring(self):
        """Stop the network monitoring"""
        print("\nStopping network monitoring...")
        self.active = False
        self.analyzer_thread.join()
        self.stats_thread.join()
        self.client.close()
        logging.info("Network monitoring stopped")

def main():
    try:
        monitor = NetworkMonitor()
        monitor.start_monitoring()
    except KeyboardInterrupt:
        print("\nReceived keyboard interrupt, shutting down...")
    except Exception as e:
        print(f"Error during execution: {e}")
        logging.error(f"Fatal error: {str(e)}")
    finally:
        if 'monitor' in locals():
            monitor.stop_monitoring()

if __name__ == "__main__":
    main()