
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component without SSR
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Define the expected structure of the chart's props
interface CompromisedProgramsChartProps {
  data: { sensorId: string; programs: any[] | null | undefined }[]; // programs could be null or undefined
}

const CompromisedProgramsChart: React.FC<CompromisedProgramsChartProps> = ({ data }) => {
  // Log the incoming data for debugging
  console.log("Data passed to chart:", data);

  // Check if data is valid
  if (!data || data.length === 0) {
    return <div>No data available to display.</div>;
  }

  // Filter to get only the first 10 entries
  const filteredData = data.slice(0, 10);

  // Map data for the chart series, with a safety check for programs
  const series = [
    {
      name: "Total Programs",
      data: filteredData.map((d) =>
        Array.isArray(d.programs) ? d.programs.length : 0 // Safely access the length of programs
      ),
    },
  ];

  // Log the series for debugging
  console.log("Chart Series:", series);

  // Define the chart options
  const options: ApexOptions = {
    chart: {
      type: "bar", // Specify the chart type as a bar chart
      height: 350,
    },
    title: {
      text: "Total Programs by Sensor ID", // Title of the chart
    },
    xaxis: {
      categories: filteredData.map((d) => d.sensorId), // x-axis: sensor IDs
      title: {
        text: "Sensor IDs", // X-axis title
      },
    },
    yaxis: {
      title: {
        text: "Total Programs", // Y-axis title
      },
    },
  };

  // Render the chart with options and series
  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default CompromisedProgramsChart;

////////////////
