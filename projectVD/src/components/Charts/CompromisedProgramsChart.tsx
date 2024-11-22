"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CompromisedProgramsChartProps {
  data: { sensorId: string; programs: any[] | null | undefined }[];
}

const CompromisedProgramsChart: React.FC<CompromisedProgramsChartProps> = ({ data }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartOptions, setChartOptions] = useState<ApexOptions>({});
  const [series, setSeries] = useState<any[]>([]);

  // Professional color palette
  const colorPalette = [
    "#2563eb", // Primary Blue
    "#1d4ed8", // Darker Blue
    "#3b82f6", // Lighter Blue
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
    if (!data || data.length === 0) return;

    // Filter to get only the first 10 entries
    const filteredData = data.slice(0, 10);

    setSeries([
      {
        name: "Total Programs",
        data: filteredData.map((d) =>
          Array.isArray(d.programs) ? d.programs.length : 0
        ),
      },
    ]);

    setChartOptions({
      chart: {
        type: "bar",
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
        text: "Total Programs by Sensor ID",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: isDarkMode ? "#e5e7eb" : "#111827",
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: "60%",
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toString();
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: [isDarkMode ? "#e5e7eb" : "#374151"],
        },
      },
      grid: {
        show: true,
        borderColor: isDarkMode ? "#374151" : "#e5e7eb",
        strokeDashArray: 2,
        position: "back",
      },
      xaxis: {
        categories: filteredData.map((d) => d.sensorId),
        title: {
          text: "Sensor IDs",
          style: {
            fontSize: "14px",
            fontWeight: "500",
            color: isDarkMode ? "#e5e7eb" : "#374151",
          },
        },
        labels: {
          style: {
            colors: isDarkMode ? "#e5e7eb" : "#374151",
            fontSize: "12px",
          },
          rotateAlways: false,
          rotate: -45,
          trim: true,
          maxHeight: 120,
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
          text: "Total Programs",
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
      },
      tooltip: {
        theme: isDarkMode ? "dark" : "light",
        y: {
          formatter: (value) => value.toString(),
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
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: "darken",
            value: 0.15,
          },
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
            plotOptions: {
              bar: {
                columnWidth: "80%",
              },
            },
          },
        },
      ],
    });
  }, [data, isDarkMode]);

  if (!data || data.length === 0) {
    return <div>No data available to display.</div>;
  }

  return (
    <div className={isDarkMode ? "dark-mode-wrapper" : "light-mode-wrapper"}>
      <ReactApexChart 
        options={chartOptions} 
        series={series} 
        type="bar" 
        height={350} 
      />
    </div>
  );
};

export default CompromisedProgramsChart;