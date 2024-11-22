"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableFour from "@/components/Tables/TableFour";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Service {
  name: string;
  port: number;
  status: string;
  dangerous: boolean;
}

interface Sensor {
  _id: string;
  sensorId: string;
  deviceName?: string;
  all_open_ports?: number[];
  services?: { services: Service[]; all_open_ports?: number[] }[];
}

const fetchPortData = async (companyId: string): Promise<Sensor[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${companyId}/ports`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch port data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching port data:", error);
    return [];
  }
};

const TablesPage = () => {
  const [sensorData, setSensorData] = useState<Sensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const updatePortData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPortData("670300d49e3775f3873461fd");
      setSensorData(data);
      setLastUpdated(new Date());

      if (!selectedSensorId && data.length > 0) {
        const firstSensorId = data[0].sensorId;
        setSelectedSensorId(firstSensorId);
      }
    } catch (error) {
      console.error("Error updating port data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSensorId]);

  useEffect(() => {
    updatePortData();
    const interval = setInterval(updatePortData, 10000);
    return () => clearInterval(interval);
  }, [updatePortData]);

  const selectedSensor = useMemo(
    () => sensorData.find((sensor) => sensor.sensorId === selectedSensorId),
    [sensorData, selectedSensorId]
  );

  const calculateNumberOfOpenPorts = useCallback((sensor: Sensor): number => {
    const nestedOpenPorts =
      sensor.services?.flatMap((service) => service.all_open_ports || []) || [];
    const directOpenPorts = sensor.all_open_ports || [];
    const uniquePorts = new Set([...directOpenPorts, ...nestedOpenPorts]);
    return uniquePorts.size;
  }, []);

  const calculateNumberOfDangerousServices = useCallback(
    (sensor: Sensor): number => {
      const allServices =
        sensor.services?.flatMap((service) => service.services) || [];
      return allServices.filter((service) => service.dangerous).length;
    },
    []
  );

  const sensorOptions = useMemo(() => {
    return sensorData.map((sensor) => ({
      id: sensor.sensorId,
      name: sensor.deviceName || sensor.sensorId,
      openPorts: calculateNumberOfOpenPorts(sensor),
      dangerousServices: calculateNumberOfDangerousServices(sensor),
    }));
  }, [sensorData, calculateNumberOfOpenPorts, calculateNumberOfDangerousServices]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Port Monitoring" />

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            {sensorData.length > 0 ? (
              <>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Select Device
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSensorId}
                        onChange={(e) => setSelectedSensorId(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      >
                        {sensorOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={updatePortData}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>

                {/* Last Updated */}
                {lastUpdated && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}

                {/* Stats Cards */}
                {selectedSensor && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        Open Ports
                      </div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {calculateNumberOfOpenPorts(selectedSensor)}
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div className="text-red-600 dark:text-red-400 text-sm font-medium">
                        Dangerous Services
                      </div>
                      <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {calculateNumberOfDangerousServices(selectedSensor)}
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                        Total Services
                      </div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {selectedSensor.services?.reduce(
                          (acc, service) => acc + (service.services?.length || 0),
                          0
                        ) || 0}
                      </div>
                    </div>
                  </div>
                )}

                {/* Port Table */}
                {selectedSensor && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <TableFour
                      sensor={selectedSensor}
                      onPortChange={updatePortData}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="mt-2 text-sm">No devices available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;