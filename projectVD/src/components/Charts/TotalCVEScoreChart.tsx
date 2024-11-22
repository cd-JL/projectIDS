"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TotalCVEScoreChartProps {
  data: { deviceName: string; totalCveScore: number }[];
}

const TotalCVEScoreChart: React.FC<TotalCVEScoreChartProps> = ({ data }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartOptions, setChartOptions] = useState<ApexOptions>({});
  const [series, setSeries] = useState<any[]>([]);

  // Professional color palette
  const colorPalette = [
    "#2563eb", // Primary Blue
    "#3b82f6", // Secondary Blue
    "#60a5fa", // Accent Blue
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

    setSeries([
      {
        name: "Total CVE Score",
        data: data.map(d => d.totalCveScore),
      },
    ]);

    setChartOptions({
      chart: {
        type: "line",
        height: 350,
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        foreColor: isDarkMode ? "#e5e7eb" : "#374151",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      colors: colorPalette,
      title: {
        text: "Total CVE Score by Sensor",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: isDarkMode ? "#e5e7eb" : "#111827",
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      markers: {
        size: 6,
        strokeWidth: 0,
        hover: {
          size: 8,
        },
      },
      grid: {
        show: true,
        borderColor: isDarkMode ? "#374151" : "#e5e7eb",
        strokeDashArray: 2,
        position: "back",
      },
      xaxis: {
        categories: data.map(d => d.deviceName),
        title: {
          text: "Sensors",
          style: {
            fontSize: "14px",
            fontWeight: "500",
            color: isDarkMode ? "#e5e7eb" : "#374151",
          },
        },
        labels: {
          style: {
            colors: isDarkMode ? "#e5e7eb" : "#374151",
          },
        },
        axisBorder: {
          color: isDarkMode ? "#374151" : "#e5e7eb",
        },
        axisTicks: {
          color: isDarkMode ? "#374151" : "#e5e7eb",
        },
      },
      yaxis: {
        title: {
          text: "Total CVE Score",
          style: {
            fontSize: "14px",
            fontWeight: "500",
            color: isDarkMode ? "#e5e7eb" : "#374151",
          },
        },
        labels: {
          style: {
            colors: isDarkMode ? "#e5e7eb" : "#374151",
          },
          formatter: (value) => value.toFixed(1),
        },
      },
      tooltip: {
        theme: isDarkMode ? "dark" : "light",
        y: {
          formatter: (value) => value.toFixed(2),
        },
        style: {
          fontSize: "14px",
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "14px",
        fontWeight: "500",
        labels: {
          colors: isDarkMode ? "#e5e7eb" : "#374151",
        },
        markers: {
          width: 12,
          height: 12,
          radius: 6,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetY: 7,
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
        type="line" 
        height={350} 
      />
    </div>
  );
};

export default TotalCVEScoreChart;