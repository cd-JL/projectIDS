"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CompromisedProgramsChartProps {
  data: { program: string; count: number }[];
}

const CompromisedProgramsChart: React.FC<CompromisedProgramsChartProps> = ({ data }) => {
  const series = [
    {
      name: "Instances",
      data: data.map(d => d.count),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    xaxis: {
      categories: data.map(d => d.program),
      title: {
        text: "Compromised Programs",
      },
    },
    yaxis: {
      title: {
        text: "Number of Instances",
      },
    },
  };

  return (
    <div>
      <h3>Compromised Programs Across All Sensors</h3>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default CompromisedProgramsChart;
