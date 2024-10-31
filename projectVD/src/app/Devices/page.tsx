"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";  // Ensure path is correct
import TableThree from "@/components/Tables/TableThree";

interface Sensor {
  _id: string;
  deviceName?: string;
  active: boolean;
}

// Fetch device data for the specific company ID
const fetchDeviceData = async (id: string): Promise<Sensor[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/devices`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch device data: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Device Data:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching device data:", error);
    return [];
  }
};

const TablesPage = () => {
  const [deviceData, setDeviceData] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  const updateDeviceData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }

    const data = await fetchDeviceData("670300d49e3775f3873461fd");
    setDeviceData(data);

    if (isInitialLoad) {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateDeviceData(true);

    const interval = setInterval(() => {
      updateDeviceData();
    }, 5000);

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
        ) : deviceData.length > 0 ? (
          <TableThree sensors={deviceData} />
        ) : (
          <p>No devices available</p>
        )}
      </div>
      
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
