// The ChartTwo component shows a bar chart of total vulnerabilities for each device using the react-apexcharts library in a Next.js application. 
// It takes a prop that includes an array of device names and their total vulnerabilities. The component loads the ReactApexChart dynamically, 
// sets up the chart options (like axis titles and type), and prepares the data for the chart. 
// Finally, it displays the chart in a div with a heading that explains what the chart is about.

"use client"; // Indicating that this file should be treated as a client component in a Next.js app

import React from "react"; // Importing the React library to use its features
import dynamic from "next/dynamic"; // Importing the dynamic function from Next.js for dynamic component loading
import { ApexOptions } from "apexcharts"; // Importing the ApexOptions type for defining chart options

// Dynamically importing the ReactApexChart component from the react-apexcharts library, disabling server-side rendering
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Defining the props type for the ChartTwo component
interface ChartTwoProps {
  data: { deviceName: string; totalVulnerabilities: number }[]; // The data prop should be an array of objects, each containing a device name and its total vulnerabilities
}

// Defining the ChartTwo functional component
const ChartTwo: React.FC<ChartTwoProps> = ({ data }) => {
  // Creating the series data for the chart by mapping the total vulnerabilities from the data prop
  const series = [
    {
      name: "Total Vulnerabilities", // Name for the data series
      data: data.map(d => d.totalVulnerabilities), // Extracting the total vulnerabilities values from the data
    },
  ];

  // Defining the options for the chart, including chart type and axis titles
  const options: ApexOptions = {
    chart: {
      type: "bar", // Specifying the chart type as a bar chart
      height: 350, // Setting the height of the chart
    },
    xaxis: {
      categories: data.map(d => d.deviceName), // Setting the x-axis categories to the device names from the data
      title: {
        text: "Devices", // Title for the x-axis
      },
    },
    yaxis: {
      title: {
        text: "Total Vulnerabilities", // Title for the y-axis
      },
    },
  };

  // Rendering the chart within a div, along with a heading
  return (
    <div>
      <h3>Total Vulnerabilities by Device</h3> // Heading for the chart
      <ReactApexChart options={options} series={series} type="bar" height={350} /> // Rendering the ReactApexChart with the defined options and series
    </div>
  );
};

// Exporting the ChartTwo component for use in other parts of the application
export default ChartTwo;
