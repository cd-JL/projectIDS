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

// Fetch port data for the specific company ID
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
    console.log("Fetched Port Data:", data);
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

  const updatePortData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPortData("670300d49e3775f3873461fd");
      console.log('Fetched sensor data:', data);
      setSensorData(data);

      // Set the selected sensor to the first one if not set
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
    return sensorData.map((sensor) => {
      const numberOfOpenPorts = calculateNumberOfOpenPorts(sensor);
      const numberOfDangerousServices =
        calculateNumberOfDangerousServices(sensor);

      return (
        <option key={sensor.sensorId} value={sensor.sensorId}>
          {sensor.deviceName || sensor.sensorId} | Open Ports: {numberOfOpenPorts} | Dangerous
          Services: {numberOfDangerousServices}
        </option>
      );
    });
  }, [
    sensorData,
    calculateNumberOfOpenPorts,
    calculateNumberOfDangerousServices,
  ]);

  const handleSensorChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const sensorId = event.target.value;
      setSelectedSensorId(sensorId);
    },
    []
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Device Status" />

      <div className="flex flex-col gap-10 bg-white dark:bg-gray-900 p-6">
        {loading ? (
          <LoadingSpinner />
        ) : sensorData.length > 0 ? (
          <>
            <div className="flex justify-between mb-4">
              <select
                value={selectedSensorId}
                onChange={handleSensorChange}
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                {sensorOptions}
              </select>
              <button
                onClick={updatePortData}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh Data
              </button>
            </div>
            {selectedSensor && (
              <TableFour
                sensor={selectedSensor}
                onPortChange={updatePortData}
              />
            )}
          </>
        ) : (
          <p className="text-center dark:text-white">No devices available</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
