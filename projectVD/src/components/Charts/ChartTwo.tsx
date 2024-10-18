"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartTwoProps {
  data: { deviceName: string; totalVulnerabilities: number }[];
}

const ChartTwo: React.FC<ChartTwoProps> = ({ data }) => {
  const series = [
    {
      name: "Total Vulnerabilities",
      data: data.map(d => d.totalVulnerabilities),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    xaxis: {
      categories: data.map(d => d.deviceName),
      title: {
        text: "Devices",
      },
    },
    yaxis: {
      title: {
        text: "Total Vulnerabilities",
      },
    },
  };

  return (
    <div>
      <h3>Total Vulnerabilities by Device</h3>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ChartTwo;
