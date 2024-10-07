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

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSensorData('670300d49e3775f3873461fd'); // Replace with the actual company ID
      setSensorData(data);
    };

    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        {sensorData.length > 0 ? (
          sensorData.map((sensor, index) => (
            <TableOne key={sensor._id} sensor={sensor} />
          ))
        ) : (
          <p>No sensors available</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
