import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartTwoProps {
  data: { deviceName: string; totalVulnerabilities: number }[];
}

const ChartTwo: React.FC<ChartTwoProps> = ({ data }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    setIsDarkMode(body.classList.contains("dark"));

    // Optional: Listen for class changes if dark mode can be toggled dynamically
    const observer = new MutationObserver(() => {
      setIsDarkMode(body.classList.contains("dark"));
    });

    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

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
      toolbar: {
        show: true,
      },
      // Adjust chart background based on dark mode
      background: isDarkMode ? "#1e1e1e" : "#ffffff",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        colors: {
          backgroundBarColors: isDarkMode ? ["#333"] : ["#f3f4f6"],
          // You can customize bar colors further if needed
        },
      },
    },
    title: {
      text: "Total Vulnerabilities by Device",
      style: {
        color: isDarkMode ? "#ffffff" : "#000000",
      },
    },
    xaxis: {
      categories: data.map(d => d.deviceName),
      title: {
        text: "Total Vulnerabilities",
      },
    },
    yaxis: {
      title: {
        text: "Devices",
      },
    },

  };

  return (
    <div className={isDarkMode ? "dark-mode-wrapper" : "light-mode-wrapper"}>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
      {/* Wrap other text elements similarly */}
    </div>
  );
};

export default ChartTwo;
