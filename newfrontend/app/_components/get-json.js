
"use client"; 
import React from "react";

import Records from './docker_docker_desktop_4.33.1.json';
// import Records from 'scripts\vulnerabilities\microsoft_microsoft_edge_129.0.2792.79.json';

function Fetch_json() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-10">
      <div className="w-full max-w-4xl px-10">
        {
          // Ensure Records exists and has at least one element, and check if vulnerabilities exist
          Records?.[0]?.vulnerabilities?.length > 0 ? (
            Records[0].vulnerabilities.map((record, index) => {
              return (
                <div className="w-full bg-white p-10 shadow-md border border-black mt-20" key={index}>
                  {/* Display the CVE ID */}
                  <strong>{record?.cve?.id || "No ID available"}</strong>
                
                  {/* Flexbox container for side-by-side display */}
                  <div className="flex flex-row justify-between gap-10 w-full mt-5">
                    
                    {/* Descriptions */}
                    <div className="flex-1 bg-white p-5 shadow-md border border-black">
                      <h4 className="font-semibold">Descriptions:</h4>
                      {
                        record?.cve?.descriptions?.length > 0 ? (
                          record.cve.descriptions.map((description, descIndex) => {
                            return (
                              <p key={descIndex}>
                                {description.lang === "en" && description.value}
                              </p>
                            );
                          })
                        ) : (
                          <p>No descriptions available</p>
                        )
                      }
                    </div>

                    {/* References */}
                    <div className="flex-1 bg-white p-5 shadow-md border border-black">
                      <h4 className="font-semibold">References:</h4>
                      {
                        record?.cve?.references?.length > 0 ? (
                          record.cve.references.map((reference, refIndex) => {
                            return (
                              <p key={refIndex}>
                                <a href={reference.url} target="_blank" rel="noopener noreferrer">
                                  {reference.source}
                                </a>
                              </p>
                            );
                          })
                        ) : (
                          <p>No references available</p>
                        )
                      }
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <p>No vulnerabilities available</p>
          )
        }
      </div>
    </main>
  );
}

export default Fetch_json;
