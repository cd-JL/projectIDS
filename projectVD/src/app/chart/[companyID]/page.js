
// The BasicChartPage component gets/shows data about sensors for a specific company using the companyID from the URL. 
// It keeps track of several states, such as whether it's loading, any error messages, and formatted data for vulnerabilities, CVE scores, and compromised programs. 
// The data is pulled from an API, processed to find important numbers, and the state is updated. 
// Finally, it shows loading messages, error messages, or three charts depending on the data it fetches.
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ChartTwo from "@/components/Charts/ChartTwo";
import TotalCVEScoreChart from "@/components/Charts/TotalCVEScoreChart";
import CompromisedProgramsChart from "@/components/Charts/CompromisedProgramsChart";
import ChartExploitability from "@/components/Charts/expl";

// Retrieve URL parameters using the useParams hook.
// Extract the companyID parameter from the URL, if it exists.
// If the companyID is not present, it will be undefined.
const BasicChartPage = () => {
  const params = useParams();
  const companyID = params?.companyID;

  const [expData, setExpData] = useState([]);
  const [formattedData, setFormattedData] = useState([]); // Initialize state for storing format data with an empty array
  const [programsData, setProgramsData] = useState([]);
  const [cveScoresData, setCveScoresData] = useState([]); // Initialize state for storing CVE scores data with an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect allows you to perform side effect in function component (data fetching, subscriptions, etc) or manually changing DOM, and run it after component renders
  useEffect(() => {
    if (!companyID) {
      setError("companyID is missing.");
      setLoading(false);
      return;
    }
  

     // Async allows task to run concurrently without blocking main execution (improve responsive/efficiency)
    const fetchData = async () => {
      try {  
        const response = await fetch(`/api/companies/${companyID}/sensors`); // Await pauses execution until fetch promise resolves, ensuring the response is available
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        } // This code asynchronously fetches sensor data for a specific company using its companyID, and throws an error if the request fails.

        const sensorsWithDetails = await response.json();
        console.log(sensorsWithDetails); // Log the raw API response to inspect the fetched data
        //This code parses the fetched response as JSON, storing sensor data in sensorsWithDetails variable,then logs data into console.

        // Prepare data for ChartExploitability
        const expData = sensorsWithDetails.map(sensor => {
          const exploitabilityScore = sensor.vulnerabilities ? sensor.vulnerabilities.length : 0;

          return {
            deviceName: sensor.deviceName || "Unknown Device",
            exploitabilityScore,
          };
        });
        console.log(expData); // Log the data formatted for ChartExploitability

        // Prepare data for ChartTwo
        const formattedData = sensorsWithDetails.map(sensor => {
          const totalVulnerabilities = sensor.vulnerabilities ? sensor.vulnerabilities.length : 0; // Counts vulnerabilities
          return {
            deviceName: sensor.deviceName || "Unknown Device", // Sets device name or defaults to "Unknown Device"
            totalVulnerabilities, // Stores total vulnerabilities count
          };
        });
        // code formats sensor data by mapping over each sensor/creating new object for each one. 
        // It calculates the total number of vulnerabilities (if any) for each sensor and returns an object with the sensor's device name 
        // (or "Unknown Device" if no name is provided) and the total number of vulnerabilities.

        // Prepare data for TotalCVEScoreChart
        const cveScores = sensorsWithDetails.map(sensor => { // Iterate over each sensor in sensorsWithDetails
          let totalCveScore = 0; // Initialize total CVE score for each sensor
          if (sensor.vulnerabilities) {
            totalCveScore = sensor.vulnerabilities.reduce((acc, v) => {
              if (!v.vulnerabilityData) return acc; // Skip if no vulnerability data
              const vulnerabilities = v.vulnerabilityData.vulnerabilities || []; // Get vulnerabilities array
              vulnerabilities.forEach(cveEntry => {
                const baseSeverityV3 = cveEntry.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0; // CVSS v3.1 score
                const baseSeverityV2 = cveEntry.cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0; // CVSS v2 score
                acc += Math.max(baseSeverityV3, baseSeverityV2); // Use the highest score
              });
              return acc;
            }, 0);
          }
          return {
            deviceName: sensor.deviceName || "Unknown Device",
            totalCveScore,
          };
        });
        // This code calculates the total CVE score for each sensor by iterating over its vulnerabilities. 
        // For each vulnerability, it checks for the presence of severity scores in both CVSS v3.1 and v2, using the highest score available. 
        // The total score is accumulated and returned with the sensor's device name.


        // Prepare data for CompromisedProgramsChart
        const compromisedProgramsCount = {};
        sensorsWithDetails.forEach(sensor => {
          if (sensor.programs) {
            sensor.programs.forEach(program => {
              if (program?.cveCount > 0) {
                compromisedProgramsCount[program.name] = (compromisedProgramsCount[program.name] || 0) + 1;
              }
            });
          }
        });

        const programsData = Object.entries(compromisedProgramsCount).map(([program, count]) => ({
          program,
          count,
        }));

        // Update state with fetched and formatted data
        setExpData(expData.length > 0 ? expData : [{ deviceName: "No Data", exploitabilityScore: 0 }]);
        setFormattedData(formattedData.length > 0 ? formattedData : [{ deviceName: "No Data", totalVulnerabilities: 0 }]);
        setCveScoresData(cveScores.length > 0 ? cveScores : [{ deviceName: "No Data", totalCveScore: 0 }]);
        setProgramsData(programsData.length > 0 ? programsData : [{ program: "No Data", count: 0 }]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vulnerability data:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchData();
  }, [companyID]);

  // render the chart
  return (
    <DefaultLayout>
      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <>
          <ChartExploitability data={expData} />
          <ChartTwo data={formattedData} /> // Render the ChartTwo component with formatted sensor data
          <TotalCVEScoreChart data={cveScoresData} /> // Render the TotalCVEScoreChart component with CVE scores data
          <CompromisedProgramsChart data={programsData} />
        </>
      )}
    </DefaultLayout>
  );
};

export default BasicChartPage;
















// The BasicChartPage component gets and shows data about sensors for a specific company using the companyID from the URL. 
// It keeps track of several states, such as whether it's loading, any error messages, and formatted data for vulnerabilities, CVE scores, and compromised programs. 
// The data is pulled from an API, processed to find important numbers, and the state is updated. 
// Finally, it shows loading messages, error messages, or three charts depending on the data it fetches.

// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import ChartTwo from "@/components/Charts/ChartTwo";
// import TotalCVEScoreChart from "@/components/Charts/TotalCVEScoreChart";
// import CompromisedProgramsChart from "@/components/Charts/CompromisedProgramsChart";

// const BasicChartPage = () => {
//   const params = useParams();
//   console.log("Params object:", params);

//   const companyID = params?.companyID;
//   console.log("Extracted companyID from useParams:", companyID);

//   const [formattedData, setFormattedData] = useState([]);
//   const [programsData, setProgramsData] = useState([]);
//   const [cveScoresData, setCveScoresData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // useEffect allows you to perform side effect in function component (data fetching, subscriptions, etc) or manually changing DOM, and run it after component renders
//   useEffect(() => {
//     if (!companyID) {
//       setError("companyID is missing.");
//       setLoading(false);
//       return;
//     }

//     // Async allows task to run concurrently without blocking main execution (improve responsive/efficiency)
//     const fetchData = async () => {
//       try {
//         console.log("Fetching data for companyID:", companyID);
//         const response = await fetch(`/api/companies/${companyID}/sensors`);
//         console.log("Response status:", response.status);

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch data: ${response.statusText}, ${errorText}`);
//         }

//         const sensorsWithDetails = await response.json();
//         console.log("Fetched data:", sensorsWithDetails);

//         // Data for ChartTwo: count of vulnerabilities per sensor
//         const data = sensorsWithDetails.map(sensor => {
//           const totalVulnerabilities = sensor.vulnerabilities ? sensor.vulnerabilities.length : 0;

//           return {
//             deviceName: sensor.deviceName || "Unknown Device", // Refer to deviceName
//             totalVulnerabilities,
//           };
//         });
//         console.log("Formatted data for ChartTwo:", data);

//         // Data for TotalCVEScoreChart: CVE scores by sensor (sum of base scores using the higher between v2 and v3)
//         // map create create new array by applying provided callback funtion to each element of OG array (transform value without mddifying the OG array)
//         const cveScores = sensorsWithDetails.map(sensor => {
//           let totalCveScore = 0;

//           if (sensor.vulnerabilities) {
//             totalCveScore = sensor.vulnerabilities.reduce((acc, v) => {
//               // Log vulnerability data to verify its structure
//               console.log("Vulnerability data for sensor:", v);

//               // Ensure `vulnerabilityData` exists to prevent undefined property access
//               if (!v.vulnerabilityData) {
//                 return acc; // Skip this entry if `vulnerabilityData` is missing
//               }

//               // Extract vulnerabilities array from `vulnerabilityData`
//               const vulnerabilities = v.vulnerabilityData.vulnerabilities || [];

//               // Iterate over each CVE in the `vulnerabilities` array
//               vulnerabilities.forEach(cveEntry => {
//                 if (!cveEntry.cve || !cveEntry.cve.metrics) {
//                   return; // Skip this entry if `cve` or `metrics` is missing
//                 }

//                 // Get the base scores from v3 and v2 metrics if available
//                 const baseSeverityV3 = cveEntry.cve.metrics.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
//                 const baseSeverityV2 = cveEntry.cve.metrics.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;

//                 // Take the higher of the v2 or v3 base score
//                 const highestBaseSeverity = Math.max(baseSeverityV3, baseSeverityV2);

//                 acc += highestBaseSeverity;
//               });

//               return acc;
//             }, 0);
//           }

//           return {
//             deviceName: sensor.deviceName || "Unknown Device", // Refer to deviceName
//             totalCveScore,
//           };
//         });
//         console.log("Formatted data for TotalCVEScoreChart:", cveScores);

//         // Data for CompromisedProgramsChart: number of compromised programs across sensors
//         const compromisedProgramsCount = {};
//         sensorsWithDetails.forEach(sensor => {
//           if (sensor.programs) {
//             sensor.programs.forEach(program => {
//               if (program?.cveCount > 0) {
//                 compromisedProgramsCount[program.name] = (compromisedProgramsCount[program.name] || 0) + 1;
//               }
//             });
//           }
//         });

//         const programsData = Object.entries(compromisedProgramsCount).map(([program, count]) => ({
//           program,
//           count,
//         }));
//         console.log("Formatted data for CompromisedProgramsChart:", programsData);

//         // Set state only if data arrays are defined
//         setFormattedData(data.length > 0 ? data : [{ deviceName: "No Data", totalVulnerabilities: 0 }]);
//         setCveScoresData(cveScores.length > 0 ? cveScores : [{ deviceName: "No Data", totalCveScore: 0 }]);
//         setProgramsData(programsData.length > 0 ? programsData : [{ program: "No Data", count: 0 }]);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching vulnerability data:", error);
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [companyID]);

//   return (
//     <DefaultLayout>
//       {loading && <p>Loading data...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       {!loading && !error && (
//         <>
//           <ChartTwo data={formattedData} />
//           <TotalCVEScoreChart data={cveScoresData} />
//           <CompromisedProgramsChart data={programsData} />
//         </>
//       )}
//     </DefaultLayout>
//   );
// };

// export default BasicChartPage;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import ChartTwo from "@/components/Charts/ChartTwo";
// import TotalCVEScoreChart from "@/components/Charts/TotalCVEScoreChart";
// import CompromisedProgramsChart from "@/components/Charts/CompromisedProgramsChart";
// import ChartExploitability from "@/components/Charts/expl";

// const BasicChartPage = () => {
//   const params = useParams();
//   const companyID = params?.companyID;

//   const [expData, setExpData] = useState([]);
//   const [formattedData, setFormattedData] = useState([]);
//   const [programsData, setProgramsData] = useState([]);
//   const [cveScoresData, setCveScoresData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!companyID) {
//       setError("companyID is missing.");
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/companies/${companyID}/sensors`);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch data: ${response.statusText}`);
//         }

//         const sensorsWithDetails = await response.json();

//         // Prepare data for ChartExploitability
//         const expData = sensorsWithDetails.map(sensor => {
//           const exploitabilityScore = sensor.exploitabilityScore || 0;

//           return {
//             deviceName: sensor.deviceName || "Unknown Device",
//             exploitabilityScore,
//           };
//         });

//         // Prepare data for ChartTwo
//         const formattedData = sensorsWithDetails.map(sensor => {
//           const totalVulnerabilities = sensor.vulnerabilities ? sensor.vulnerabilities.length : 0;
//           return {
//             deviceName: sensor.deviceName || "Unknown Device",
//             totalVulnerabilities,
//           };
//         });

//         // Prepare data for TotalCVEScoreChart
//         const cveScores = sensorsWithDetails.map(sensor => {
//           let totalCveScore = 0;
//           if (sensor.vulnerabilities) {
//             totalCveScore = sensor.vulnerabilities.reduce((acc, v) => {
//               if (!v.vulnerabilityData) return acc;
//               const vulnerabilities = v.vulnerabilityData.vulnerabilities || [];
//               vulnerabilities.forEach(cveEntry => {
//                 const baseSeverityV3 = cveEntry.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
//                 const baseSeverityV2 = cveEntry.cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;
//                 acc += Math.max(baseSeverityV3, baseSeverityV2);
//               });
//               return acc;
//             }, 0);
//           }
//           return {
//             deviceName: sensor.deviceName || "Unknown Device",
//             totalCveScore,
//           };
//         });

//         // Prepare data for CompromisedProgramsChart
//         const compromisedProgramsCount = {};
//         sensorsWithDetails.forEach(sensor => {
//           if (sensor.programs) {
//             sensor.programs.forEach(program => {
//               if (program?.cveCount > 0) {
//                 compromisedProgramsCount[program.name] = (compromisedProgramsCount[program.name] || 0) + 1;
//               }
//             });
//           }
//         });

//         const programsData = Object.entries(compromisedProgramsCount).map(([program, count]) => ({
//           program,
//           count,
//         }));

//         // Update state with fetched and formatted data
//         setExpData(expData.length > 0 ? expData : [{ deviceName: "No Data", exploitabilityScore: 0 }]);
//         setFormattedData(formattedData.length > 0 ? formattedData : [{ deviceName: "No Data", totalVulnerabilities: 0 }]);
//         setCveScoresData(cveScores.length > 0 ? cveScores : [{ deviceName: "No Data", totalCveScore: 0 }]);
//         setProgramsData(programsData.length > 0 ? programsData : [{ program: "No Data", count: 0 }]);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching vulnerability data:", error);
//         setError(error instanceof Error ? error.message : "An unexpected error occurred.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [companyID]);

//   return (
//     <DefaultLayout>
//       {loading && <p>Loading data...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       {!loading && !error && (
//         <>
//           <ChartExploitability data={expData} />
//           <ChartTwo data={formattedData} />
//           <TotalCVEScoreChart data={cveScoresData} />
//           <CompromisedProgramsChart data={programsData} />
//         </>
//       )}
//     </DefaultLayout>
//   );
// };

// export default BasicChartPage;

