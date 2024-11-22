"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartExploitabilityProps {
  data: { deviceName: string; exploitabilityScore: number }[];
}

const ChartExploitability: React.FC<ChartExploitabilityProps> = ({ data }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartOptions, setChartOptions] = useState<ApexOptions>({});
  const [series, setSeries] = useState<number[]>([]);

  // Professional color palette that works well in both modes
  const colorPalette = [
    "#2563eb", // Blue
    "#3b82f6", // Lighter Blue
    "#0284c7", // Sky Blue
    "#0891b2", // Cyan
    "#0d9488", // Teal
    "#059669", // Green
    "#4f46e5", // Indigo
    "#6366f1", // Purple
    "#7c3aed", // Violet
    "#9333ea"  // Deep Purple
  ];

  useEffect(() => {
    const body = document.body;
    const updateDarkMode = () => {
      const darkModeEnabled = body.classList.contains("dark");
      setIsDarkMode(darkModeEnabled);
    };

    updateDarkMode();
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    setSeries(data.map(d => d.exploitabilityScore));

    setChartOptions({
      chart: {
        type: "donut",
        height: 350,
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        foreColor: isDarkMode ? "#e5e7eb" : "#374151", // Text color
      },
      colors: colorPalette,
      labels: data.map(d => d.deviceName),
      title: {
        text: "Exploitability Score by Device",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: isDarkMode ? "#e5e7eb" : "#111827",
        },
      },
      theme: {
        mode: isDarkMode ? "dark" : "light",
      },
      legend: {
        position: "bottom",
        fontSize: "14px",
        labels: {
          colors: isDarkMode ? "#e5e7eb" : "#374151",
        },
        markers: {
          width: 12,
          height: 12,
          radius: 6,
        },
      },
      stroke: {
        width: 2,
        colors: [isDarkMode ? "#1e1e1e" : "#ffffff"],
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            labels: {
              show: true,
              total: {
                show: true,
                fontSize: "16px",
                fontWeight: "600",
                color: isDarkMode ? "#e5e7eb" : "#111827",
              },
              value: {
                fontSize: "16px",
                fontWeight: "500",
                color: isDarkMode ? "#e5e7eb" : "#374151",
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "14px",
          fontWeight: "500",
          colors: [isDarkMode ? "#e5e7eb" : "#374151"],
        },
        dropShadow: {
          enabled: false,
        },
      },
      tooltip: {
        enabled: true,
        theme: isDarkMode ? "dark" : "light",
        style: {
          fontSize: "14px",
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    });
  }, [data, isDarkMode]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div className={isDarkMode ? "dark-mode-wrapper" : "light-mode-wrapper"}>
      <ReactApexChart 
        options={chartOptions} 
        series={series} 
        type="donut" 
        height={350} 
      />
    </div>
  );
};

export default ChartExploitability;