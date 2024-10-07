"use client";
import React from "react";

export async function getServerSideProps(context) {
  const { id } = context.params;

  // Fetch the company details from your API endpoint
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}`);
  const company = await res.json();

  // Log the company data to the server console
  console.log("Company Data (Server-Side):", company);

  return {
    props: {
      company,
    },
  };
}

export default function CompanyDetails({ company }) {
  // Log the company data to the browser console
  console.log("Company Data (Client-Side):", company);

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-10">
      <div className="w-full max-w-4xl px-10">
        {/* Display company details */}
        <div className="w-full bg-white p-10 shadow-md border border-black mt-20">
          <h1 className="text-3xl font-bold">{company.name || "No Company Name Available"}</h1>

          {/* Display users for the company */}
          <div className="flex flex-col w-full mt-5">
            <h4 className="font-semibold text-lg">Users:</h4>
            {company?.users?.length > 0 ? (
              company.users.map((user, index) => (
                <div key={index} className="bg-white p-5 shadow-md border border-black mt-2">
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                </div>
              ))
            ) : (
              <p>No users available</p>
            )}
          </div>

          {/* Display sensors for the company */}
          <div className="flex flex-col w-full mt-5">
            <h4 className="font-semibold text-lg">Sensors:</h4>
            {company?.sensors?.length > 0 ? (
              company.sensors.map((sensor, index) => (
                <div key={index} className="bg-white p-5 shadow-md border border-black mt-2">
                  <p>
                    <strong>Sensor ID:</strong> {sensor.sensorId}
                  </p>
                  <p>
                    <strong>Type:</strong> {sensor.type}
                  </p>
                  {sensor.vulnerabilities && sensor.vulnerabilities.length > 0 ? (
                    <div className="mt-4">
                      <h5 className="font-semibold">Vulnerabilities:</h5>
                      {sensor.vulnerabilities.map((vulnerability, vIndex) => (
                        <div
                          key={vIndex}
                          className="bg-gray-100 p-3 shadow-sm border border-black mt-2"
                        >
                          <strong>{vulnerability.cve?.id || "No CVE ID Available"}</strong>

                          {/* Descriptions */}
                          <div className="mt-2">
                            <h6 className="font-semibold">Descriptions:</h6>
                            {vulnerability.cve?.descriptions?.length > 0 ? (
                              vulnerability.cve.descriptions.map((desc, descIndex) => (
                                <p key={descIndex}>
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
                                <p key={refIndex}>
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
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No vulnerabilities available for this sensor</p>
                  )}
                </div>
              ))
            ) : (
              <p>No sensors available</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
