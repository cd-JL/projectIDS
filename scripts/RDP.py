"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableThree from "@/components/Tables/TableThree";

interface Sensor {
  _id: string;
  deviceName?: string;
  active: boolean;
  sensorId?: string;
}

interface ConnectionResponse {
  success: boolean;
  message: string;
  sensorId?: string;
}

const TablesPage = () => {
  const [deviceData, setDeviceData] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  // Fetch device data for the specific company ID
  const fetchDeviceData = async (id: string): Promise<Sensor[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/devices`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch device data: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching device data:", error);
      return [];
    }
  };

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

  const initiateConnection = async () => {
    try {
      setConnectionStatus({ message: "Attempting to connect...", type: null });
      
      const response = await fetch("http://localhost:8000/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ConnectionResponse = await response.json();

      if (data.success) {
        setConnectionStatus({
          message: `Successfully connected! Sensor ID: ${data.sensorId}`,
          type: "success",
        });
        // Refresh device data after successful connection
        updateDeviceData();
      } else {
        setConnectionStatus({
          message: data.message || "Connection failed",
          type: "error",
        });
      }
    } catch (error) {
      setConnectionStatus({
        message: "Failed to connect to device. Make sure the device endpoint is running.",
        type: "error",
      });
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
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Devices</h2>
          <button
            onClick={initiateConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Connect New Device
          </button>
        </div>

        {connectionStatus.message && (
          <div
            className={`p-4 rounded-lg ${
              connectionStatus.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : connectionStatus.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {connectionStatus.message}
          </div>
        )}

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