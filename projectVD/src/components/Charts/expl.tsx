
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

  // For a donut chart, the series should be the array of values (exploitability scores)
  const series = data.map(d => d.exploitabilityScore); // Array of exploitability scores for the donut chart

  // Defining the options for the donut chart
  const options: ApexOptions = {
    chart: {
      type: "donut", // Changed the chart type to 'donut'
      height: 350,
    },
    labels: data.map(d => d.deviceName), // Labels will be the device names
    title: {
      text: "Exploitability Score by Device Percentage", // Title of the chart
      // style: {
      //   color: "white", // Set the title text color to white
      // },
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
      <ReactApexChart options={options} series={series} type="donut" height={350} />
    </div>
  );
};

export default ChartExploitability;
