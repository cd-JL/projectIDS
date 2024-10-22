

// "use client"; // Indicating that this file should be treated as a client component in a Next.js app

// import React from "react"; // Importing the React library to use its features
// import dynamic from "next/dynamic"; // Importing the dynamic function from Next.js for dynamic component loading
// import { ApexOptions } from "apexcharts"; // Importing the ApexOptions type for defining chart options

// // Dynamically importing the ReactApexChart component from the react-apexcharts library, disabling server-side rendering
// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// // Defining the props type for the TotalCVEScoreChart component
// interface TotalCVEScoreChartProps {
//   data: { deviceName: string; totalCveScore: number }[]; // The data prop should be an array of objects, each containing a device name and its total CVE score
// }

// // Defining the TotalCVEScoreChart functional component
// const TotalCVEScoreChart: React.FC<TotalCVEScoreChartProps> = ({ data }) => {
//   // Creating the series data for the chart by mapping the total CVE score values from the data prop
//   const series = [
//     {
//       name: "Total CVE Score", // Name for the data series
//       data: data.map(d => d.totalCveScore), // Extracting the total CVE score values from the data
//     },
//   ];

//   // Defining the options for the chart, including chart type and axis titles
//   const options: ApexOptions = {
//     chart: {
//       type: "bar", // Specifying the chart type as a bar chart
//       height: 350, // Setting the height of the chart
//     },
//     xaxis: {
//       categories: data.map(d => d.deviceName), // Setting the x-axis categories to the device names from the data
//       title: {
//         text: "Sensors", // Title for the x-axis
//       },
//     },
//     yaxis: {
//       title: {
//         text: "Total CVE Score", // Title for the y-axis
//       },
//     },
//   };

//   // Rendering the chart within a div, along with a heading
//   return (
//     <div>
//       <h3>Total CVE Score by Sensor</h3> // Heading for the chart
//       <ReactApexChart options={options} series={series} type="bar" height={350} /> // Rendering the ReactApexChart with the defined options and series
//     </div>
//   );
// };

// // Exporting the TotalCVEScoreChart component for use in other parts of the application
// export default TotalCVEScoreChart;

"use client"; // Indicating that this file should be treated as a client component in a Next.js app

import React from "react"; // Importing the React library to use its features
import dynamic from "next/dynamic"; // Importing the dynamic function from Next.js for dynamic component loading
import { ApexOptions } from "apexcharts"; // Importing the ApexOptions type for defining chart options

// Dynamically importing the ReactApexChart component from the react-apexcharts library, disabling server-side rendering
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Defining the props type for the TotalCVEScoreChart component
interface TotalCVEScoreChartProps {
  data: { deviceName: string; totalCveScore: number }[]; // The data prop should be an array of objects, each containing a device name and its total CVE score
}

// Defining the TotalCVEScoreChart functional component
const TotalCVEScoreChart: React.FC<TotalCVEScoreChartProps> = ({ data }) => {
  // Creating the series data for the chart by mapping the total CVE score values from the data prop
  const series = [
    {
      name: "Total CVE Score", // Name for the data series
      data: data.map(d => d.totalCveScore), // Extracting the total CVE score values from the data
    },
  ];

  // Defining the options for the chart, including chart type and axis titles
  const options: ApexOptions = {
    chart: {
      type: "line", // Changed the chart type to 'line'
      height: 350, // Setting the height of the chart
    },
    title: {
      text: "Total CVE Score by Sensor", // Title of the chart
    },
    xaxis: {
      categories: data.map(d => d.deviceName), // Setting the x-axis categories to the device names from the data
      title: {
        text: "Sensors", // Title for the x-axis
      },
    },
    yaxis: {
      title: {
        text: "Total CVE Score", // Title for the y-axis
      },
    },
    stroke: {
      curve: 'smooth', // Optional: Makes the line smooth
    },
  };

  // Rendering the chart within a div, along with a heading
  return (
    <div>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

// Exporting the TotalCVEScoreChart component for use in other parts of the application
export default TotalCVEScoreChart;
