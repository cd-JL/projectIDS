"use client"; // Add this line to make it a client component

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/TableThree"; // Import the new TableThree component
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const fetchSensorData = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/sensors`);

    if (!response.ok) {
      throw new Error(`Failed to fetch sensor data: ${response.status}`);
    }

    const data = await response.json();
    //console.log("Sensors Data (Client-Side):", data);
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return [];
  }
};

const TablesPage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for the first load

  // Function to fetch sensor data and update the state
  const updateSensorData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true); // Show spinner only on initial load
    }

    const data = await fetchSensorData("670300d49e3775f3873461fd"); // Replace with the actual company ID
    setSensorData(data);

    if (isInitialLoad) {
      setLoading(false); // Hide spinner after first load
    }
  };

  // Fetch data on initial render and set interval to update every 5 seconds
  useEffect(() => {
    updateSensorData(true); // Fetch initial data with spinner

    const interval = setInterval(() => {
      updateSensorData(); // Fetch updated data every 5 seconds without showing spinner
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Device Status" />

      <div className="flex flex-col gap-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          </div>
        ) : sensorData.length > 0 ? (
          <TableThree sensors={sensorData} />
        ) : (
          <p>No devices available</p>
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
