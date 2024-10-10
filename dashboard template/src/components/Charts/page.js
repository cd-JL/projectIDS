// "use client";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import ChartOne from "@/components/Charts/ChartOne";
// import ChartTwo from "@/components/Charts/ChartTwo";
// import dynamic from "next/dynamic";
// import React from "react";


// const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
//   ssr: false,
// });

// const Chart: React.FC = () => {
//   return (
//     <>
//       <Breadcrumb pageName="Chart" />

//       <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
//         <ChartOne />
//         <ChartTwo />
//         <ChartThree />
//       </div>
//     </>
//   );
// };

// export default Chart;

// "use client";
// import { PowerBIEmbed } from 'powerbi-client-react';
// import { models } from 'powerbi-client';
// import { useEffect, useState } from 'react';

// function Chart() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     // This will run only on the client side
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return null; // Don't render anything on the server side
//   }

//   return (
//     <div>
//       <p>This is chart page</p>
//       <PowerBIEmbed
//         embedConfig={{
//           type: 'report',
//           id: 'd4288097-9fcf-4841-a0da-0975c31020b1',
//           embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=d4288097-9fcf-4841-a0da-0975c31020b1&groupId=7890ad15-f978-4ea2-9f5c-3b39caf96dcd&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtVVMtQy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19',
//           accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZjUyZjIxODMtOWY2Ny00YWQyLWI2NTYtNmY3NTRmZTE5NmNiLyIsImlhdCI6MTcyODUyMTU3NywibmJmIjoxNzI4NTIxNTc3LCJleHAiOjE3Mjg1MjYxMDQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WUFBQUFRR1AzZElnSDB1c2xJVFFyTUFzclphcFlGTk0zVDFXek83K3pmS3VDZExuTVR5ODc5SlV2MXV5eVpKdnBqa3lvK1JVbnpLVTV5cloxWkQ2dzR3SlhOU3ZJZDI0S2VveGtybmQzY0VXUTFUdz0iLCJhbXIiOlsicHdkIiwicnNhIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiJiY2E0ZGM1OS1hMGI3LTQ0MDItYmU0Yi00ZjhlMjllMDM1YWYiLCJmYW1pbHlfbmFtZSI6Ik5heSIsImdpdmVuX25hbWUiOiJTdGFkaXVtIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjAwMTo1NmE6NzRhMDpkZDAwOjcxODI6NWNjMzo0MzhiOjY3NjMiLCJuYW1lIjoiU3RhZGl1bSBOYXkiLCJvaWQiOiJhMzVkNTYyNC1hZGJiLTRlZDctOTgxZi04ZWUyY2ZhOWEyZmIiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjY2NDczNzUyMC00ODEzNTMxMzctMTA5ODY3MTgzMC0xMTczNTAyIiwicHVpZCI6IjEwMDMyMDAxNjQwNDFDQUEiLCJyaCI6IjAuQVJNQWd5RXY5V2VmMGtxMlZtOTFULUdXeXdrQUFBQUFBQUFBd0FBQUFBQUFBQURhQUtBLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IkU3R0gxOFpsLVlkdDRVNVRMRkJHOXF5cHlzelE3WWg2MkNZNlg2NlFOU1EiLCJ0aWQiOiJmNTJmMjE4My05ZjY3LTRhZDItYjY1Ni02Zjc1NGZlMTk2Y2IiLCJ1bmlxdWVfbmFtZSI6IlN0YWRpdW0uTmF5QGVkdS5zYWl0LmNhIiwidXBuIjoiU3RhZGl1bS5OYXlAZWR1LnNhaXQuY2EiLCJ1dGkiOiJ1bWpSMW9aVE5rT2RNcEpNbTdta0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfaWRyZWwiOiIxIDE2In0.Lcm9GHfYCnu0i3Fjik4J9SvoTPOu8A6qEdggLjWPRd0RETYIGX5EL2sA3NR1q_zpWqNJhpBqEinu6mgxZiGASJAWca0f7_AVQYFUqRudrzFnnLt6ysbHHARuH_RbGj9ceUHyVIBbPUOvzJYNczBK491_oTi77YEPaarfkAu2BslGdskdnM9gAKpwe8WNSiY9Mf3Q5p2XuU7-qcaG5xDV43TpT94Hc4YspbsPIyttQQFoZIF0OKVawLb55owrLW9_cykDKDyeLWvuXs_eNDTgviB3V_WLvyNIWbk-U4YyH_13fi6JIQNge1rRv6zg2PGRC-CxWGVIbt0eENA2CSgJWQ', // Use a valid token
//           tokenType: models.TokenType.Aad,
//           settings: {
//             panes: {
//               filters: {
//                 expanded: false,
//                 visible: false,
//               },
//             },
//             background: models.BackgroundType.Transparent,
//           },
//         }}
//         eventHandlers={new Map([
//           ['loaded', () => console.log('Report loaded')],
//           ['rendered', () => console.log('Report rendered')],
//           ['error', (event) => console.log(event.detail)],
//           ['visualClicked', () => console.log('visual clicked')],
//           ['pageChanged', (event) => console.log(event)],
//         ])}
//         cssClassName={"Embed-container"}
//         getEmbeddedComponent={(embeddedReport) => {
//           window.report = embeddedReport;
//         }}
//       />
//     </div>
//   );
// }

// export default Chart;


import ChartOne from "./ChartOne";

function Chart() {
  return (
    <ChartOne />
  )

}
export default Chart;
