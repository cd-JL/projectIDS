"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TotalCVEScoreChartProps {
  data: { deviceName: string; totalCveScore: number }[];
}

const TotalCVEScoreChart: React.FC<TotalCVEScoreChartProps> = ({ data }) => {
  const series = [
    {
      name: "Total CVE Score",
      data: data.map(d => d.totalCveScore),
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
        text: "Sensors",
      },
    },
    yaxis: {
      title: {
        text: "Total CVE Score",
      },
    },
  };

  return (
    <div>
      <h3>Total CVE Score by Sensor</h3>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default TotalCVEScoreChart;
