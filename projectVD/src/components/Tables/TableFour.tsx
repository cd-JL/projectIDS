import React, { FC, useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';

interface Service {
  name: string;
  port: number;
  status: string;
  dangerous: boolean;
}

interface Sensor {
  sensorId: string;
  deviceName: string;
  all_open_ports?: number[];
  services?: { services: Service[] }[];
}

interface TableFourProps {
  sensor: Sensor;
}

const TableFour: FC<TableFourProps> = ({ sensor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [showDangerousOnly, setShowDangerousOnly] = useState(false);

  // Extract services from nested structure
  const services = useMemo(
    () => sensor.services?.flatMap((serviceObj) => serviceObj.services) || [],
    [sensor.services]
  );

  // Extract all_open_ports from nested services array
  const allOpenPorts = useMemo(
    () => sensor.services?.flatMap((serviceObj) => serviceObj.all_open_ports || []).filter(Boolean) || [],
    [sensor.services]
  );

  const handleSearchChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    }, 300),
    []
  );

  const handlePortSearchChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      setPortSearchTerm(event.target.value);
    }, 300),
    []
  );

  const toggleFilter = () => {
    setShowDangerousOnly((prev) => !prev);
  };

  // Filter services based on search term and danger status
  const filteredServices = useMemo(() => {
    return services
      .filter(
        (service) =>
          (!showDangerousOnly || service.dangerous) &&
          (service.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
      )
      .sort((a, b) => a.name?.localeCompare(b.name || '') || 0);
  }, [services, showDangerousOnly, searchTerm]);

  // Filter ports based on search term
  const filteredPorts = useMemo(() => {
    return allOpenPorts.filter((port) => port.toString().includes(portSearchTerm));
  }, [allOpenPorts, portSearchTerm]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">{sensor.deviceName}</h2>
      <div className="flex flex-wrap items-center mb-4">
        <button
          className="mb-2 mr-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={toggleFilter}
        >
          {showDangerousOnly ? 'Show All Services' : 'Show Dangerous Services Only'}
        </button>
        <input
          type="text"
          placeholder="Search services..."
          onChange={handleSearchChange}
          className="mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-gray-200 dark:bg-gray-700 text-left">Service Name</th>
              <th className="py-2 px-4 border-b bg-gray-200 dark:bg-gray-700 text-left">Port</th>
              <th className="py-2 px-4 border-b bg-gray-200 dark:bg-gray-700 text-left">Status</th>
              <th className="py-2 px-4 border-b bg-gray-200 dark:bg-gray-700 text-left">Dangerous</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{service.name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{service.port}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{service.status}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    {service.dangerous ? (
                      <span className="text-red-500 font-semibold">Yes</span>
                    ) : (
                      'No'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-2 px-4 text-center">
                  No services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer dark:text-white font-semibold">Show All Ports</summary>
        <input
          type="text"
          placeholder="Search ports..."
          onChange={handlePortSearchChange}
          className="my-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <ul className="list-disc pl-5">
          {filteredPorts.length > 0 ? (
            filteredPorts.map((port, index) => (
              <li key={index} className="py-1 dark:text-white">
                {port}
              </li>
            ))
          ) : (
            <li className="py-1 dark:text-white">No ports found.</li>
          )}
        </ul>
      </details>
    </div>
  );
};

export default React.memo(TableFour);
