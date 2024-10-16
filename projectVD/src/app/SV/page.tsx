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
  const [lastFetchedData, setLastFetchedData] = useState([]); // To track the last fetched data
  const [loading, setLoading] = useState(true); // Loading state for the first load

  // Function to compare two arrays of sensor data
  const isDataChanged = (newData, oldData) => {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
  };

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true); // Show spinner only on initial load
    }

    const data = await fetchSensorData("670300d49e3775f3873461fd"); // Replace with the actual company ID

    if (isDataChanged(data, lastFetchedData)) {
      setSensorData(data);
      setLastFetchedData(data); // Store the new data as the last fetched data
      if (data.length > 0) {
        setSelectedSensor(data[0]._id); // Set the first sensor as the default selection
      }
    }

    if (isInitialLoad) {
      setLoading(false); // Hide spinner after first load
    }
  };

  useEffect(() => {
    // Initial fetch of the data with spinner
    fetchData(true);

    // Set up a polling mechanism to fetch new data every 10 seconds
    const intervalId = setInterval(() => fetchData(), 10000); // 10 seconds interval

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, [lastFetchedData]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Sensor Vulnerabilities" />

      <div className="flex flex-col gap-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          </div>
        ) : (
          <>
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
                    {sensor.deviceName || `Sensor ${sensor._id}`} {/* Changed from sensor.name to sensor.deviceName */}
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
          </>
        )}
      </div>

      {/* Loader Spinner Styling */}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spinner 0.6s linear infinite;
        }

        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </DefaultLayout>
  );
};

export default TablesPage;
