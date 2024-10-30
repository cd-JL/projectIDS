"use client"; // Add this to make it a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

// Fetch vulnerability data for the specific company ID
const fetchVulnerabilityData = async (id) => {
  try {
    console.log("Fetching vulnerability data for company ID:", id); // Debug
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/vulnerabilities`);

    if (!response.ok) {
      console.error(`Failed to fetch vulnerability data. Status: ${response.status}`); // Debug
      throw new Error(`Failed to fetch vulnerability data: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched vulnerability data:", data); // Debug
    return data;
  } catch (error) {
    console.error("Error fetching vulnerability data:", error); // Debug
    return [];
  }
};

const TablesPage = () => {
  const router = useRouter(); // Use next/navigation's router
  const [vulnerabilityData, setVulnerabilityData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [lastFetchedData, setLastFetchedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDataChanged = (newData, oldData) => {
    const hasChanged = JSON.stringify(newData) !== JSON.stringify(oldData);
    console.log("Checking if data has changed:", hasChanged); // Debug
    return hasChanged;
  };

  const fetchData = async (isInitialLoad = false) => {
    const id = "670300d49e3775f3873461fd"; // Replace with dynamic company ID if available
    console.log("Starting data fetch. Initial load:", isInitialLoad); // Debug
    if (isInitialLoad) setLoading(true);

    const data = await fetchVulnerabilityData(id);

    if (isDataChanged(data, lastFetchedData)) {
      console.log("Data has changed, updating state"); // Debug
      setVulnerabilityData(data);
      setLastFetchedData(data);
      if (data.length > 0) {
        console.log("Setting selected sensor to:", data[0]._id); // Debug
        setSelectedSensor(data[0]._id);
      }
    } else {
      console.log("Data has not changed, no state update needed"); // Debug
    }

    if (isInitialLoad) setLoading(false);
  };

  useEffect(() => {
    console.log("Running useEffect to fetch initial data"); // Debug
    fetchData(true);

    const intervalId = setInterval(() => {
      console.log("Running periodic data fetch"); // Debug
      fetchData();
    }, 10000);
    return () => clearInterval(intervalId);
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
            <div className="mb-4">
              <label htmlFor="sensor-select" className="mr-2">
                Select Sensor:
              </label>
              <select
                id="sensor-select"
                value={selectedSensor}
                onChange={(e) => {
                  console.log("Sensor selected:", e.target.value); // Debug
                  setSelectedSensor(e.target.value);
                }}
                className="border rounded px-3 py-2"
              >
                {vulnerabilityData.map((sensor) => (
                  <option key={sensor._id} value={sensor._id}>
                    {sensor.deviceName || `Sensor ${sensor._id}`}
                  </option>
                ))}
              </select>
            </div>

            {vulnerabilityData.length > 0 ? (
              <TableOne sensor={vulnerabilityData.find((sensor) => sensor._id === selectedSensor)} />
            ) : (
              <p>No vulnerabilities available</p>
            )}
          </>
        )}
      </div>

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
