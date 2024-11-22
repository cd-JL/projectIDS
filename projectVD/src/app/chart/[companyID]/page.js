"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ChartTwo from "@/components/Charts/ChartTwo";
import TotalCVEScoreChart from "@/components/Charts/TotalCVEScoreChart";
import CompromisedProgramsChart from "@/components/Charts/CompromisedProgramsChart";
import ChartExploitability from "@/components/Charts/expl";

const BasicChartPage = () => {
  const params = useParams();
  const companyID = params?.companyID;

  const [expData, setExpData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [programsData, setProgramsData] = useState([]);
  const [cveScoresData, setCveScoresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyID) {
      setError("companyID is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/companies/${companyID}/sensors`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const sensorsWithDetails = await response.json();

        // Prepare data for ChartExploitability
        const expData = sensorsWithDetails.map(sensor => {
          const exploitabilityScore = sensor.vulnerabilities ? sensor.vulnerabilities.length : 0;
          return {
            deviceName: sensor.deviceName || "Unknown Device",
            exploitabilityScore,
          };
        });

        // Prepare data for ChartTwo
        const formattedData = sensorsWithDetails.map(sensor => {
          const totalVulnerabilities = sensor.vulnerabilities ? sensor.vulnerabilities.length : 0;
          return {
            deviceName: sensor.deviceName || "Unknown Device",
            totalVulnerabilities,
          };
        });

        // Prepare data for TotalCVEScoreChart
        const cveScores = sensorsWithDetails.map(sensor => {
          let totalCveScore = 0;
          if (sensor.vulnerabilities) {
            totalCveScore = sensor.vulnerabilities.reduce((acc, v) => {
              if (!v.vulnerabilityData) return acc;
              const vulnerabilities = v.vulnerabilityData.vulnerabilities || [];
              vulnerabilities.forEach(cveEntry => {
                const baseSeverityV3 = cveEntry.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
                const baseSeverityV2 = cveEntry.cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;
                acc += Math.max(baseSeverityV3, baseSeverityV2);
              });
              return acc;
            }, 0);
          }
          return {
            deviceName: sensor.deviceName || "Unknown Device",
            totalCveScore,
          };
        });

        // Prepare data for CompromisedProgramsChart
        const programsData = sensorsWithDetails.map(sensor => {
          const programs = sensor.programs || []; // Ensure programs is an array, even if empty
          return {
            sensorId: sensor.deviceName || "Unknown Device",
            programs: programs.length > 0 ? programs : null, // Set programs to null if none exist
          };
        });

        setExpData(expData.length > 0 ? expData : [{ deviceName: "No Data", exploitabilityScore: 0 }]);
        setFormattedData(formattedData.length > 0 ? formattedData : [{ deviceName: "No Data", totalVulnerabilities: 0 }]);
        setCveScoresData(cveScores.length > 0 ? cveScores : [{ deviceName: "No Data", totalCveScore: 0 }]);
        setProgramsData(programsData.length > 0 ? programsData : [{ sensorId: "No Data", programs: null }]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vulnerability data:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchData();
  }, [companyID]);

  return (
    <DefaultLayout>
      {loading && (
        <p className="text-gray-800 dark:text-gray-200 text-center mt-10">Loading data...</p>
      )}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-center mt-10">
          Error: {error}
        </p>
      )}
      {!loading && !error && (
        <>
          <div className="rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-lg transition-shadow duration-300">
              <ChartExploitability data={expData} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-lg transition-shadow duration-300">
              <ChartTwo data={formattedData} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-lg transition-shadow duration-300">
              <TotalCVEScoreChart data={cveScoresData} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-lg transition-shadow duration-300">
              <CompromisedProgramsChart data={programsData} />
            </div>
          </div>
        </>
      )}
    </DefaultLayout>
  );
  
};

export default BasicChartPage;

