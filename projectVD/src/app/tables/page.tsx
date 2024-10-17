"use client"; // Add this line to make it a client component

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const fetchSensorData = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/sensors`);

    if (!response.ok) {
      throw new Error(`Failed to fetch sensor data: ${response.status}`);
    }

    const data = await response.json();
    console.log("Sensors Data (Client-Side):", data);
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return [];
  }
};

const TablesPage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSensorData('670300d49e3775f3873461fd'); // Replace with the actual company ID
      setSensorData(data);
      if (data.length > 0) {
        setSelectedSensor(data[0]._id); // Set the first sensor as the default selection
      }
    };

    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        {/* Dropdown menu to select a sensor */}
        <div className="mb-4">
          <label htmlFor="sensor-select" className="mr-2">
            Select Sensor:
          </label>
          <select
            id="sensor-select"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {sensorData.map((sensor) => (
              <option key={sensor._id} value={sensor._id}>
                {sensor.name || `Sensor ${sensor._id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Display the table for the selected sensor */}
        {sensorData.length > 0 ? (
          <TableOne sensor={sensorData.find((sensor) => sensor._id === selectedSensor)} />
        ) : (
          <p>No sensors available</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
