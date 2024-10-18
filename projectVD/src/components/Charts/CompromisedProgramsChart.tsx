
// The CompromisedProgramsChart component shows how many times compromised programs appear across all sensors in a 
// bar chart using the react-apexcharts library in a Next.js application. 
// It takes a prop with an array of program names and their counts. 
// The component loads the ReactApexChart dynamically, sets up the data and chart options, including titles for the axes and the chart type. 
// Finally, it displays the chart in a div with a heading that explains what the chart is about.

"use client"; // Indicating that this file should be treated as a client component in a Next.js app

import React from "react"; // Importing the React library to use its features
import dynamic from "next/dynamic"; // Importing the dynamic function from Next.js for dynamic component loading
import { ApexOptions } from "apexcharts"; // Importing the ApexOptions type for defining chart options

// Dynamically importing the ReactApexChart component from the react-apexcharts library, disabling server-side rendering
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Defining the props type for the CompromisedProgramsChart component
interface CompromisedProgramsChartProps {
  data: { program: string; count: number }[]; // The data prop should be an array of objects, each containing a program name and its instance count
}

// Defining the CompromisedProgramsChart functional component
const CompromisedProgramsChart: React.FC<CompromisedProgramsChartProps> = ({ data }) => {
  // Creating the series data for the chart by mapping the count values from the data prop
  const series = [
    {
      name: "Instances", // Name for the data series
      data: data.map(d => d.count), // Extracting the count values from the data
    },
  ];

  // Defining the options for the chart, including chart type and axis titles
  const options: ApexOptions = {
    chart: {
      type: "bar", // Specifying the chart type as a bar chart
      height: 350, // Setting the height of the chart
    },
    xaxis: {
      categories: data.map(d => d.program), // Setting the x-axis categories to the program names from the data
      title: {
        text: "Compromised Programs", // Title for the x-axis
      },
    },
    yaxis: {
      title: {
        text: "Number of Instances", // Title for the y-axis
      },
    },
  };

  // Rendering the chart within a div, along with a heading
  return (
    <div>
      <h3>Compromised Programs Across All Sensors</h3> // Heading for the chart
      <ReactApexChart options={options} series={series} type="bar" height={350} /> // Rendering the ReactApexChart with the defined options and series
    </div>
  );
};

// Exporting the CompromisedProgramsChart component for use in other parts of the application
export default CompromisedProgramsChart;
