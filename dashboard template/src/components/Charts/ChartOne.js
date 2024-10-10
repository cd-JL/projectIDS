// "use client";

// import { ApexOptions } from "apexcharts";
// import React from "react";
// import dynamic from "next/dynamic";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// const options: ApexOptions = {
//   legend: {
//     show: false,
//     position: "top",
//     horizontalAlign: "left",
//   },
//   colors: ["#3C50E0", "#80CAEE"],
//   chart: {
//     fontFamily: "Satoshi, sans-serif",
//     height: 335,
//     type: "area",
//     dropShadow: {
//       enabled: true,
//       color: "#623CEA14",
//       top: 10,
//       blur: 4,
//       left: 0,
//       opacity: 0.1,
//     },

//     toolbar: {
//       show: false,
//     },
//   },
//   responsive: [
//     {
//       breakpoint: 1024,
//       options: {
//         chart: {
//           height: 300,
//         },
//       },
//     },
//     {
//       breakpoint: 1366,
//       options: {
//         chart: {
//           height: 350,
//         },
//       },
//     },
//   ],
//   stroke: {
//     width: [2, 2],
//     curve: "straight",
//   },
//   // labels: {
//   //   show: false,
//   //   position: "top",
//   // },
//   grid: {
//     xaxis: {
//       lines: {
//         show: true,
//       },
//     },
//     yaxis: {
//       lines: {
//         show: true,
//       },
//     },
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   markers: {
//     size: 4,
//     colors: "#fff",
//     strokeColors: ["#3056D3", "#80CAEE"],
//     strokeWidth: 3,
//     strokeOpacity: 0.9,
//     strokeDashArray: 0,
//     fillOpacity: 1,
//     discrete: [],
//     hover: {
//       size: undefined,
//       sizeOffset: 5,
//     },
//   },
//   xaxis: {
//     type: "category",
//     categories: [
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//     ],
//     axisBorder: {
//       show: false,
//     },
//     axisTicks: {
//       show: false,
//     },
//   },
//   yaxis: {
//     title: {
//       style: {
//         fontSize: "0px",
//       },
//     },
//     min: 0,
//     max: 100,
//   },
// };

// interface ChartOneState {
//   series: {
//     name: string;
//     data: number[];
//   }[];
// }

// const ChartOne: React.FC = () => {
//   const series = [
//       {
//         name: "Product One",
//         data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
//       },

//       {
//         name: "Product Two",
//         data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
//       },
//     ]

//   return (
//     <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
//       <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
//         <div className="flex w-full flex-wrap gap-3 sm:gap-5">
//           <div className="flex min-w-47.5">
//             <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
//               <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
//             </span>
//             <div className="w-full">
//               <p className="font-semibold text-primary">Total Revenue</p>
//               <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
//             </div>
//           </div>
//           <div className="flex min-w-47.5">
//             <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
//               <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
//             </span>
//             <div className="w-full">
//               <p className="font-semibold text-secondary">Total Sales</p>
//               <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex w-full max-w-45 justify-end">
//           <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
//             <button className="rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
//               Day
//             </button>
//             <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
//               Week
//             </button>
//             <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
//               Month
//             </button>
//           </div>
//         </div>
//       </div>

//       <div>
//         <div id="chartOne" className="-ml-5">
//           <ReactApexChart
//             options={options}
//             series={series}
//             type="area"
//             height={350}
//             width={"100%"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartOne;


"use client";
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { useEffect, useState } from 'react';
import React from "react";
import './chart.css'

function ChartOne() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will run only on the client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render anything on the server side
  }

  return (
    <div>
      <p>This is chart page</p>
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: 'd4288097-9fcf-4841-a0da-0975c31020b1',
          embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=d4288097-9fcf-4841-a0da-0975c31020b1&groupId=7890ad15-f978-4ea2-9f5c-3b39caf96dcd&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtVVMtQy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19',
          accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZjUyZjIxODMtOWY2Ny00YWQyLWI2NTYtNmY3NTRmZTE5NmNiLyIsImlhdCI6MTcyODUyMTU3NywibmJmIjoxNzI4NTIxNTc3LCJleHAiOjE3Mjg1MjYxMDQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WUFBQUFRR1AzZElnSDB1c2xJVFFyTUFzclphcFlGTk0zVDFXek83K3pmS3VDZExuTVR5ODc5SlV2MXV5eVpKdnBqa3lvK1JVbnpLVTV5cloxWkQ2dzR3SlhOU3ZJZDI0S2VveGtybmQzY0VXUTFUdz0iLCJhbXIiOlsicHdkIiwicnNhIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiJiY2E0ZGM1OS1hMGI3LTQ0MDItYmU0Yi00ZjhlMjllMDM1YWYiLCJmYW1pbHlfbmFtZSI6Ik5heSIsImdpdmVuX25hbWUiOiJTdGFkaXVtIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjAwMTo1NmE6NzRhMDpkZDAwOjcxODI6NWNjMzo0MzhiOjY3NjMiLCJuYW1lIjoiU3RhZGl1bSBOYXkiLCJvaWQiOiJhMzVkNTYyNC1hZGJiLTRlZDctOTgxZi04ZWUyY2ZhOWEyZmIiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjY2NDczNzUyMC00ODEzNTMxMzctMTA5ODY3MTgzMC0xMTczNTAyIiwicHVpZCI6IjEwMDMyMDAxNjQwNDFDQUEiLCJyaCI6IjAuQVJNQWd5RXY5V2VmMGtxMlZtOTFULUdXeXdrQUFBQUFBQUFBd0FBQUFBQUFBQURhQUtBLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IkU3R0gxOFpsLVlkdDRVNVRMRkJHOXF5cHlzelE3WWg2MkNZNlg2NlFOU1EiLCJ0aWQiOiJmNTJmMjE4My05ZjY3LTRhZDItYjY1Ni02Zjc1NGZlMTk2Y2IiLCJ1bmlxdWVfbmFtZSI6IlN0YWRpdW0uTmF5QGVkdS5zYWl0LmNhIiwidXBuIjoiU3RhZGl1bS5OYXlAZWR1LnNhaXQuY2EiLCJ1dGkiOiJ1bWpSMW9aVE5rT2RNcEpNbTdta0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfaWRyZWwiOiIxIDE2In0.Lcm9GHfYCnu0i3Fjik4J9SvoTPOu8A6qEdggLjWPRd0RETYIGX5EL2sA3NR1q_zpWqNJhpBqEinu6mgxZiGASJAWca0f7_AVQYFUqRudrzFnnLt6ysbHHARuH_RbGj9ceUHyVIBbPUOvzJYNczBK491_oTi77YEPaarfkAu2BslGdskdnM9gAKpwe8WNSiY9Mf3Q5p2XuU7-qcaG5xDV43TpT94Hc4YspbsPIyttQQFoZIF0OKVawLb55owrLW9_cykDKDyeLWvuXs_eNDTgviB3V_WLvyNIWbk-U4YyH_13fi6JIQNge1rRv6zg2PGRC-CxWGVIbt0eENA2CSgJWQ', // Use a valid token
          tokenType: models.TokenType.Aad,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
            },
            background: models.BackgroundType.Transparent,
          },
        }}
        eventHandlers={new Map([
          ['loaded', () => console.log('Report loaded')],
          ['rendered', () => console.log('Report rendered')],
          ['error', (event) => console.log(event.detail)],
          ['visualClicked', () => console.log('visual clicked')],
          ['pageChanged', (event) => console.log(event)],
        ])}
        cssClassName={"Embed-container"}
        getEmbeddedComponent={(embeddedReport) => {
          window.report = embeddedReport;
        }}
      />
    </div>
  );
}

export default ChartOne;
