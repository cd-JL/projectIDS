"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableTwo from "@/components/Tables/TableTwo";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

// Fetch program data for the specific company ID
const fetchProgramData = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/programs`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch program data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching program data:", error);
    return [];
  }
};

const TablesPage = () => {
  const [programData, setProgramData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [lastFetchedData, setLastFetchedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isDataChanged = (newData, oldData) => {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
  };

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }

    const data = await fetchProgramData("670300d49e3775f3873461fd");

    if (isDataChanged(data, lastFetchedData)) {
      setProgramData(data);
      setLastFetchedData(data);
      setLastUpdated(new Date());
      if (data.length > 0 && !selectedSensor) {
        setSelectedSensor(data[0]._id);
      }
    }

    if (isInitialLoad) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(() => fetchData(), 10000);
    return () => clearInterval(intervalId);
  }, [lastFetchedData]);

  useEffect(() => {
    if (selectedSensor) {
      const selected = programData.find((sensor) => sensor._id === selectedSensor);
      if (selected && selected.programs) {
        const filtered = selected.programs.filter((program) => {
          const name = program.Name ? program.Name.toLowerCase() : "";
          const version = program.Version ? program.Version.toLowerCase() : "";
          return name.includes(searchQuery.toLowerCase()) || version.includes(searchQuery.toLowerCase());
        });
        setFilteredPrograms(filtered);
      }
    }
  }, [selectedSensor, searchQuery, programData]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Sensor Programs" />

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                {/* Sensor Selection */}
                <div className="flex-1">
                  <label htmlFor="sensor-select" className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Select Sensor
                  </label>
                  <div className="relative">
                    <select
                      id="sensor-select"
                      value={selectedSensor}
                      onChange={(e) => setSelectedSensor(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    >
                      {programData.map((sensor) => (
                        <option key={sensor._id} value={sensor._id}>
                          {sensor.deviceName || `Sensor ${sensor._id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Programs */}
                <div className="flex-1">
                  <label htmlFor="search-programs" className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Search Programs
                  </label>
                  <div className="relative">
                    <input
                      id="search-programs"
                      type="text"
                      placeholder="Search by name or version..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              {lastUpdated && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Sensors</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{programData.length}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium">Programs Found</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{filteredPrograms.length}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Active Programs</div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {filteredPrograms.filter(p => p.Status === 'Active').length}
                  </div>
                </div>
              </div>

              {/* Programs Table */}
              {programData.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <TableTwo 
                    sensor={programData.find((sensor) => sensor._id === selectedSensor)} 
                    programs={filteredPrograms} 
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
                  </svg>
                  <p className="mt-2 text-sm">No sensors available</p>
                </div>
              )}
            </div>
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