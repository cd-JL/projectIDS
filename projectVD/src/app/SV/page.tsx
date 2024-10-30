"use client"; // Marks this as a client-side component in Next.js

// Import necessary React hooks and components
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

// Function to fetch sensor data from the API
// Takes a company ID and returns sensor data
const fetchSensorData = async (id: string) => {
  try {
    // Make API call to get sensors for a specific company
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/sensors`);

    if (!response.ok) {
      throw new Error(`Failed to fetch sensor data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return []; // Return empty array if there's an error
  }
};

const TablesPage = () => {
  // State management
  const [sensorData, setSensorData] = useState([]); // Stores all sensor data
  const [selectedSensor, setSelectedSensor] = useState(""); // Tracks currently selected sensor
  const [lastFetchedData, setLastFetchedData] = useState([]); // Keeps track of previous data for comparison
  const [loading, setLoading] = useState(true); // Controls loading spinner visibility

  // Helper function to compare old and new sensor data
  // Returns true if data has changed
  const isDataChanged = (newData, oldData) => {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
  };

  // Function to fetch data and update state if necessary
  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true); // Show loading spinner on first load only
    }

    // Fetch data for a specific company (ID is hardcoded here)
    const data = await fetchSensorData("670300d49e3775f3873461fd");

    // Only update state if new data is different from last fetched data
    if (isDataChanged(data, lastFetchedData)) {
      setSensorData(data);
      setLastFetchedData(data);
      if (data.length > 0) {
        setSelectedSensor(data[0]._id); // Select first sensor by default
      }
    }

    if (isInitialLoad) {
      setLoading(false); // Hide spinner after initial load
    }
  };

  // Effect hook to handle data fetching
  useEffect(() => {
    // Initial data fetch
    fetchData(true);

    // Set up polling every 10 seconds to keep data fresh
    const intervalId = setInterval(() => fetchData(), 10000);

    // Cleanup function to remove interval when component unmounts
    return () => clearInterval(intervalId);
  }, [lastFetchedData]);

  // Component render
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Sensor Vulnerabilities" />

      <div className="flex flex-col gap-10">
        {/* Show loading spinner or content based on loading state */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          </div>
        ) : (
          <>
            {/* Dropdown to select different sensors */}
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
                    {sensor.deviceName || `Sensor ${sensor._id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Display table for selected sensor or message if no sensors */}
            {sensorData.length > 0 ? (
              <TableOne sensor={sensorData.find((sensor) => sensor._id === selectedSensor)} />
            ) : (
              <p>No sensors available</p>
            )}
          </>
        )}
      </div>

      {/* CSS for loading spinner animation */}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spinner 0.6s linear infinite;
        }

        @keyframes spinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </DefaultLayout>
  );
};

export default TablesPage;