"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartExploitabilityProps {
  data: { deviceName: string; exploitabilityScore: number }[];
}

const ChartExploitability: React.FC<ChartExploitabilityProps> = ({ data }) => {
  // Debugging: Log data to verify it's being passed correctly
  console.log("ChartExploitability Data:", data);

  // Ensure data is defined and is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available.</div>; // Render a message if data is not defined, not an array, or empty
  }

  // For a pie chart, the series should be the array of values (exploitability scores)
  const series = data.map(d => d.exploitabilityScore); // Array of exploitability scores for the pie chart

  // Defining the options for the pie chart
  const options: ApexOptions = {
    chart: {
      type: "pie", // Set the chart type to 'pie'
      height: 350,
    },
    labels: data.map(d => d.deviceName), // Labels will be the device names
    title: {
      text: "Exploitability Score by Device", // Title of the chart
    },
    legend: {
      position: 'bottom', // Position of the legend
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300, // Responsive width for small screens
          },
          legend: {
            position: 'bottom', // Legend position for small screens
          },
        },
      },
    ],
  };

  return (
    <div>
      <h3>Exploitability Score by Device</h3>
      <ReactApexChart options={options} series={series} type="pie" height={350} />
    </div>
  );
};

export default ChartExploitability;
