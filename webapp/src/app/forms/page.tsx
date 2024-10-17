"use client"; // Add this line to make it a client component

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableTwo from "@/components/Tables/TableTwo";
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
  const [searchQuery, setSearchQuery] = useState(""); // State to track the search input
  const [filteredPrograms, setFilteredPrograms] = useState([]); // State to track filtered programs

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSensorData("670300d49e3775f3873461fd"); // Replace with the actual company ID
      setSensorData(data);
      if (data.length > 0) {
        setSelectedSensor(data[0]._id); // Set the first sensor as the default selection
      }
    };

    fetchData();
  }, []);

  // Effect to update the filtered programs when selected sensor or search query changes
  useEffect(() => {
    if (selectedSensor) {
      const selected = sensorData.find((sensor) => sensor._id === selectedSensor);
      if (selected && selected.programs) {
        const filtered = selected.programs.filter((program) => {
          // Safely access and check for Name and Version before using toLowerCase
          const name = program.Name ? program.Name.toLowerCase() : "";
          const version = program.Version ? program.Version.toLowerCase() : "";

          // Apply search query to both fields
          return name.includes(searchQuery.toLowerCase()) || version.includes(searchQuery.toLowerCase());
        });
        setFilteredPrograms(filtered);
      }
    }
  }, [selectedSensor, searchQuery, sensorData]);

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

        {/* Search Bar */}
        <div className="mb-4">
          <label htmlFor="search-programs" className="mr-2">
            Search Programs:
          </label>
          <input
            id="search-programs"
            type="text"
            placeholder="Search by name or version"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* Display the table for the selected sensor */}
        {sensorData.length > 0 ? (
          <TableTwo sensor={sensorData.find((sensor) => sensor._id === selectedSensor)} programs={filteredPrograms} />
        ) : (
          <p>No sensors available</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
