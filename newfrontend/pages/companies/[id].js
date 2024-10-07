"use client";
import React, { useState } from "react";

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    // Fetch the sensors and their vulnerabilities from your API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/sensors`);

    if (!res.ok) {
      throw new Error(`Failed to fetch sensors data: ${res.status}`);
    }

    const sensors = await res.json();
    console.log("Sensors Data (Server-Side):", sensors);

    return {
      props: {
        sensors,
      },
    };
  } catch (error) {
    console.error("Error fetching sensors data:", error);
    return {
      props: {
        sensors: [],
      },
    };
  }
}

export default function CompanyDetails({ sensors }) {
  console.log("Sensors Data (Client-Side):", sensors);

  // State to track the selected sensor
  const [selectedSensorId, setSelectedSensorId] = useState(null);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-10">
      <div className="w-full max-w-4xl px-10">
        {/* Display sensors for the company as buttons */}
        <div className="flex flex-col w-full mt-5">
          <h4 className="font-semibold text-lg">Sensors:</h4>
          {sensors.length > 0 ? (
            <div className="flex gap-2 mt-2">
              {sensors.map((sensor) => (
                <button
                  key={sensor._id.toString()} // Use MongoDB ObjectId as the key
                  onClick={() => setSelectedSensorId(sensor.sensorId)}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                    selectedSensorId === sensor.sensorId ? "bg-blue-700" : ""
                  }`}
                >
                  Sensor ID: {sensor.sensorId}
                </button>
              ))}
            </div>
          ) : (
            <p>No sensors available</p>
          )}
        </div>

        {/* Display vulnerabilities for the selected sensor */}
        <div className="flex flex-col w-full mt-5">
          {selectedSensorId ? (
            <>
              <h4 className="font-semibold text-lg">
                Vulnerabilities for Sensor ID: {selectedSensorId}
              </h4>
              {sensors
                .filter((sensor) => sensor.sensorId === selectedSensorId)
                .map((sensor) =>
                  sensor.vulnerabilities && sensor.vulnerabilities.length > 0 ? (
                    sensor.vulnerabilities.map((vulnGroup) => (
                      <div key={vulnGroup._id.toString()} className="mt-5">
                        <h5 className="font-semibold">
                          Source File: {vulnGroup.sourceFile}
                        </h5>
                        {vulnGroup.vulnerabilities.map((vulnerability, vIndex) => {
                          // Extract CVSS metrics V2 and V3.1
                          const cvssMetricsV2 =
                            vulnerability.cve?.metrics?.cvssMetricV2?.[0]?.cvssData;
                          const cvssMetricsV31 =
                            vulnerability.cve?.metrics?.cvssMetricV31?.[0]?.cvssData;

                          return (
                            <div
                              key={`${vulnGroup._id.toString()}-vuln-${vIndex}`}
                              className="bg-gray-100 p-3 shadow-sm border border-black mt-2"
                            >
                              <strong>{vulnerability.cve?.id || "No CVE ID Available"}</strong>

                              {/* Source Identifier */}
                              <p className="mt-2">
                                <strong>Source Identifier:</strong>{" "}
                                {vulnerability.cve?.sourceIdentifier || "N/A"}
                              </p>

                              {/* Descriptions */}
                              <div className="mt-2">
                                <h6 className="font-semibold">Descriptions:</h6>
                                {vulnerability.cve?.descriptions?.length > 0 ? (
                                  vulnerability.cve.descriptions.map((desc, descIndex) => (
                                    <p key={`${vulnGroup._id.toString()}-desc-${descIndex}`}>
                                      {desc.lang === "en" && desc.value}
                                    </p>
                                  ))
                                ) : (
                                  <p>No descriptions available</p>
                                )}
                              </div>

                              {/* References */}
                              <div className="mt-2">
                                <h6 className="font-semibold">References:</h6>
                                {vulnerability.cve?.references?.length > 0 ? (
                                  vulnerability.cve.references.map((ref, refIndex) => (
                                    <p key={`${vulnGroup._id.toString()}-ref-${refIndex}`}>
                                      <a
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {ref.source}
                                      </a>
                                    </p>
                                  ))
                                ) : (
                                  <p>No references available</p>
                                )}
                              </div>

                              {/* CVSS Metrics V2 */}
                              <div className="mt-2">
                                <h6 className="font-semibold">CVSS Metrics V2:</h6>
                                {cvssMetricsV2 ? (
                                  <>
                                    <p>
                                      <strong>Base Score:</strong>{" "}
                                      {cvssMetricsV2.baseScore ?? "N/A"}
                                    </p>
                                    <p>
                                      <strong>Base Severity:</strong>{" "}
                                      {cvssMetricsV2.baseSeverity ?? "N/A"}
                                    </p>
                                    <p>
                                      <strong>Exploitability Score:</strong>{" "}
                                      {vulnerability.cve.metrics?.cvssMetricV2?.[0]?.exploitabilityScore ?? "N/A"}
                                    </p>
                                    <p>
                                      <strong>Impact Score:</strong>{" "}
                                      {vulnerability.cve.metrics?.cvssMetricV2?.[0]?.impactScore ?? "N/A"}
                                    </p>
                                  </>
                                ) : (
                                  <p>No CVSS metrics V2 available</p>
                                )}
                              </div>

                              {/* CVSS Metrics V3.1 */}
                              <div className="mt-2">
                                <h6 className="font-semibold">CVSS Metrics V3.1:</h6>
                                {cvssMetricsV31 ? (
                                  <>
                                    <p>
                                      <strong>Base Score:</strong>{" "}
                                      {cvssMetricsV31.baseScore ?? "N/A"}
                                    </p>
                                    <p>
                                      <strong>Exploitability Score:</strong>{" "}
                                      {cvssMetricsV31.exploitabilityScore ?? vulnerability.cve.metrics?.cvssMetricV31?.[0]?.exploitabilityScore ?? "N/A"}
                                    </p>
                                    <p>
                                      <strong>Impact Score:</strong>{" "}
                                      {cvssMetricsV31.impactScore ?? vulnerability.cve.metrics?.cvssMetricV31?.[0]?.impactScore ?? "N/A"}
                                    </p>
                                  </>
                                ) : (
                                  <p>No CVSS metrics V3.1 available</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  ) : (
                    <p>No vulnerabilities available for this sensor</p>
                  )
                )}
            </>
          ) : (
            <p>Select a sensor to view its vulnerabilities</p>
          )}
        </div>
      </div>
    </main>
  );
}
