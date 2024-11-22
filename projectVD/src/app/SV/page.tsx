"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Vulnerability {
  severity: 'high' | 'medium' | 'low';
  status: string;
}

interface Sensor {
  _id: string;
  deviceName?: string;
  vulnerabilities?: Vulnerability[];
}

const fetchVulnerabilityData = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/vulnerabilities`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch vulnerability data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching vulnerability data:", error);
    return [];
  }
};

const TablesPage = () => {
  const router = useRouter();
  const [vulnerabilityData, setVulnerabilityData] = useState<Sensor[]>([]);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [lastFetchedData, setLastFetchedData] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isDataChanged = (newData: Sensor[], oldData: Sensor[]) => {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
  };

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);

    const data = await fetchVulnerabilityData("670300d49e3775f3873461fd");

    if (isDataChanged(data, lastFetchedData)) {
      setVulnerabilityData(data);
      setLastFetchedData(data);
      setLastUpdated(new Date());
      if (data.length > 0 && !selectedSensor) {
        setSelectedSensor(data[0]._id);
      }
    }

    if (isInitialLoad) setLoading(false);
  };

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(() => fetchData(), 10000);
    return () => clearInterval(intervalId);
  }, [lastFetchedData]);

  const selectedSensorData = useMemo(
    () => vulnerabilityData.find((sensor) => sensor._id === selectedSensor),
    [vulnerabilityData, selectedSensor]
  );

  const vulnerabilityStats = useMemo(() => {
    if (!selectedSensorData?.vulnerabilities) return { high: 0, medium: 0, low: 0, total: 0 };
    
    return selectedSensorData.vulnerabilities.reduce(
      (acc, vuln) => {
        acc[vuln.severity]++;
        acc.total++;
        return acc;
      },
      { high: 0, medium: 0, low: 0, total: 0 }
    );
  }, [selectedSensorData]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Vulnerability Scanner" />

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            {vulnerabilityData.length > 0 ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Select Device
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSensor}
                        onChange={(e) => setSelectedSensor(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 p-2.5"
                      >
                        {vulnerabilityData.map((sensor) => (
                          <option key={sensor._id} value={sensor._id}>
                            {sensor.deviceName || `Sensor ${sensor._id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => fetchData()}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Scan Now
                  </button>
                </div>

                {lastUpdated && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Last scan: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="text-red-600 dark:text-red-400 text-sm font-medium">
                      High Risk
                    </div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                      {vulnerabilityStats.high}
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                      Medium Risk
                    </div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                      {vulnerabilityStats.medium}
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Low Risk
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {vulnerabilityStats.low}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                      Total Vulnerabilities
                    </div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {vulnerabilityStats.total}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  {selectedSensorData && <TableOne sensor={selectedSensorData} />}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                </svg>
                <p className="mt-2 text-sm">No vulnerabilities detected</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .loader {
          border-top-color: #ef4444;
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