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


// import { PowerBIEmbed } from 'powerbi-client-react';
// import { models } from 'powerbi-client-react';
// function Chart() {
//   return (
//     <div>
//       <p>This is chart page</p>
//       <PowerBIEmbed
//         embedConfig={{
//           type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
//           id: 'd4288097-9fcf-4841-a0da-0975c31020b1',
//           embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=d4288097-9fcf-4841-a0da-0975c31020b1&groupId=7890ad15-f978-4ea2-9f5c-3b39caf96dcd&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtVVMtQy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19',
//           accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZjUyZjIxODMtOWY2Ny00YWQyLWI2NTYtNmY3NTRmZTE5NmNiLyIsImlhdCI6MTcyODUwNDYzNCwibmJmIjoxNzI4NTA0NjM0LCJleHAiOjE3Mjg1MDkxNDgsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WUFBQUEzQXQzQ3hhc2tmZXF5elZ2a1MxWjRhSzFxQjA0bFRuL3oybUluQnc0S0J5aGxQUCtMSm5LTXcxemc0alBuakU1MXlVSzRORWtpQlZabFVaS3pwVUZSN1ZwaWhPNlNCRU5hbWw5aHhtbkNXOD0iLCJhbXIiOlsicHdkIiwicnNhIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiJiY2E0ZGM1OS1hMGI3LTQ0MDItYmU0Yi00ZjhlMjllMDM1YWYiLCJmYW1pbHlfbmFtZSI6Ik5heSIsImdpdmVuX25hbWUiOiJTdGFkaXVtIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTk5LjExOS4yMzUuMTQyIiwibmFtZSI6IlN0YWRpdW0gTmF5Iiwib2lkIjoiYTM1ZDU2MjQtYWRiYi00ZWQ3LTk4MWYtOGVlMmNmYTlhMmZiIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTI2NjQ3Mzc1MjAtNDgxMzUzMTM3LTEwOTg2NzE4MzAtMTE3MzUwMiIsInB1aWQiOiIxMDAzMjAwMTY0MDQxQ0FBIiwicmgiOiIwLkFSTUFneUV2OVdlZjBrcTJWbTkxVC1HV3l3a0FBQUFBQUFBQXdBQUFBQUFBQUFEYUFLQS4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJFN0dIMThabC1ZZHQ0VTVUTEZCRzlxeXB5c3pRN1loNjJDWTZYNjZRTlNRIiwidGlkIjoiZjUyZjIxODMtOWY2Ny00YWQyLWI2NTYtNmY3NTRmZTE5NmNiIiwidW5pcXVlX25hbWUiOiJTdGFkaXVtLk5heUBlZHUuc2FpdC5jYSIsInVwbiI6IlN0YWRpdW0uTmF5QGVkdS5zYWl0LmNhIiwidXRpIjoiRmtXUng1TlB0MENNOHVxRnlDNFVBUSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX2lkcmVsIjoiOCAxIn0.xiA90LZDr30dlkPziRzCY8wko3zgghVECS5UYDRzJxjeFIcuxE1bPsbuAMt0udr-VVR-NowXKTfFUMBZM5UVB9a3UQ2o_uImlGzMA3cl2LXWYnFPTDC-YXaawPc1RsMl6nZz3WThMs78xN6PfmdnrjW3D43KXmo4b1D990-S8kLemhh3uv05GS0lSZHI1koTyVOdDAMUuQ-oAZlUXwZJHx-x4iVwnnbq-DVY-ykjJnk9mEZ_QJ0vaat8lyyU6HhFM0q-XNR2Qg5FNaa9VeJeYAOpzkU4s9sCB9W5mf8vtYBa7W0AUjHfuJ26-Lxs9WpvGqA7MuZ2hketNF9dikjjKA',
//           tokenType: models.TokenType.Aad, 
//           settings: {
//             panes: {
//               filters: {
//                 expanded: false,
//                 visible: false
//               }
//             },
//             background: models.BackgroundType.Transparent,
//           }
//         }}

//         eventHandlers={
//           new Map([
//             ['loaded', function () { console.log('Report loaded'); }],
//             ['rendered', function () { console.log('Report rendered'); }],
//             ['error', function (event) { console.log(event.detail); }],
//             ['visualClicked', () => console.log('visual clicked')],
//             ['pageChanged', (event) => console.log(event)],
//           ])
//         }

//         cssClassName={"reportClass"}

//         getEmbeddedComponent={(embeddedReport) => {
//           window.report = embeddedReport;
//         }}
//       />
//     </div>

//   );
// }


// export default Chart;

"use client";
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { useEffect, useState } from 'react';

function Chart() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will run only on the client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render anything on the server side
  }

  return (
    <div className="">
      <p>This is chart page</p>
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: 'd4288097-9fcf-4841-a0da-0975c31020b1',
          embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=d4288097-9fcf-4841-a0da-0975c31020b1&groupId=7890ad15-f978-4ea2-9f5c-3b39caf96dcd&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtVVMtQy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19',
          accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZjUyZjIxODMtOWY2Ny00YWQyLWI2NTYtNmY3NTRmZTE5NmNiLyIsImlhdCI6MTcyODUxNTM1MCwibmJmIjoxNzI4NTE1MzUwLCJleHAiOjE3Mjg1MjA4ODgsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WUFBQUFZTmh1NWhmNXFTWFBTSGJqbExVQnNNSWdaTU1kdXlJMk9tQnZ3QmorQWJVOEYrdTFGbUVvY09NN2NhWDBuWktrekRJV0lSU3dkc2NMWWlYWitOMEdCQWlPYjhjYTU3aVB1QU1GTzQ4UlBZRT0iLCJhbXIiOlsicHdkIiwicnNhIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiJiY2E0ZGM1OS1hMGI3LTQ0MDItYmU0Yi00ZjhlMjllMDM1YWYiLCJmYW1pbHlfbmFtZSI6Ik5heSIsImdpdmVuX25hbWUiOiJTdGFkaXVtIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjAwMTo1NmE6NzRhMDpkZDAwOjcxODI6NWNjMzo0MzhiOjY3NjMiLCJuYW1lIjoiU3RhZGl1bSBOYXkiLCJvaWQiOiJhMzVkNTYyNC1hZGJiLTRlZDctOTgxZi04ZWUyY2ZhOWEyZmIiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjY2NDczNzUyMC00ODEzNTMxMzctMTA5ODY3MTgzMC0xMTczNTAyIiwicHVpZCI6IjEwMDMyMDAxNjQwNDFDQUEiLCJyaCI6IjAuQVJNQWd5RXY5V2VmMGtxMlZtOTFULUdXeXdrQUFBQUFBQUFBd0FBQUFBQUFBQURhQUtBLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IkU3R0gxOFpsLVlkdDRVNVRMRkJHOXF5cHlzelE3WWg2MkNZNlg2NlFOU1EiLCJ0aWQiOiJmNTJmMjE4My05ZjY3LTRhZDItYjY1Ni02Zjc1NGZlMTk2Y2IiLCJ1bmlxdWVfbmFtZSI6IlN0YWRpdW0uTmF5QGVkdS5zYWl0LmNhIiwidXBuIjoiU3RhZGl1bS5OYXlAZWR1LnNhaXQuY2EiLCJ1dGkiOiJGS1J2ZDNWckYwS0RIak9zMGFVY0FRIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfaWRyZWwiOiI0IDEifQ.MuJOLFio13ZpTvk7GGARQNoKPa1C9L4Xx1-VaUuKeev0D3MPz9nlUq4TT1qQKUaNZpGqHBJxar8TjRAhIK7aol4-x16qLJYmIaYglSqjF4FsM9uSuQx7KovBXYiruakH2lnc-VNKVimWnBUZ2ungxhHG2TMX46rsoxTLfvzw0568zIhXa2NaddNxVMIHmmmT0XiiHjZGScz-U4J-mHV1rIFvKTBrQOwXV7KUKLPuhFG3YJTpx9XVHiR3Rpi63Ob9tqa5As1tVnlqLQWAwve2JjbKdSGUOS4Oj7tGS--AHs_oRu9hoGeRyfzVvb915UZKhxcw-EPXsYw4_yapoUdg9A', // Use a valid token
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

export default Chart;
