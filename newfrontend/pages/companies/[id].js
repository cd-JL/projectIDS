import { FC, useEffect, useState } from 'react';

interface Vulnerability {
  cve?: {
    id?: string;
    sourceIdentifier?: string;
    descriptions?: Array<{ lang: string; value: string }>;
    references?: Array<{ url: string; source: string }>;
    metrics?: {
      cvssMetricV2?: Array<{
        cvssData?: {
          baseScore?: number;
          baseSeverity?: string;
          exploitabilityScore?: number;
          impactScore?: number;
        };
      }>;
      cvssMetricV31?: Array<{
        cvssData?: {
          baseScore?: number;
          baseSeverity?: string;
          exploitabilityScore?: number;
          impactScore?: number;
        };
      }>;
    };
  };
}

interface Sensor {
  sensorId: string;
  vulnerabilities: Array<{
    vulnerabilities: Vulnerability[];
    sourceFile: string;
  }>;
}

interface TableOneProps {
  sensor: Sensor;
}

const TableOne: FC<TableOneProps> = ({ sensor }) => {
  const [referencesVisible, setReferencesVisible] = useState<{ [key: string]: boolean }>({});
  const [sortOrder, setSortOrder] = useState<'highest' | 'lowest'>('highest');
  const [cvesVisible, setCvesVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log("Sensor Data:", sensor);
  }, [sensor]);

  const getSortedVulnerabilities = (vulnerabilities: Vulnerability[]) => {
    return vulnerabilities.slice().sort((a, b) => {
      const severityA = a.cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseSeverity ||
                        a.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'N/A';
      const severityB = b.cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseSeverity ||
                        b.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'N/A';

      const severityRanking: Record<string, number> = {
        CRITICAL: 4,
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
        'N/A': 0,
      };

      const rankA = severityRanking[severityA.toUpperCase()] || 0;
      const rankB = severityRanking[severityB.toUpperCase()] || 0;

      return sortOrder === 'highest' ? rankB - rankA : rankA - rankB;
    });
  };

  const calculateGradient = (score: number) => {
    // Generate a gradient that smoothly transitions through green (low), orange (moderate), and red (high)
    if (score <= 5) {
      return `linear-gradient(135deg, green ${50 - score * 10}%, orange ${score * 10}%)`;
    } else {
      return `linear-gradient(135deg, orange ${(10 - score) * 10}%, red ${(score - 5) * 20}%)`;
    }
  };

  const calculateAverageV3Severity = (vulnerabilities: Vulnerability[]) => {
    let totalScore = 0;
    let count = 0;

    vulnerabilities.forEach((vulnerability) => {
      const v3Score = vulnerability.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore;
      if (v3Score !== undefined) {
        totalScore += v3Score;
        count++;
      }
    });

    return count > 0 ? totalScore / count : 0;
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Sensor ID: {sensor.sensorId}
      </h4>

      <div className="flex flex-col">
        {/* Sorting Dropdown */}
        <div className="mb-4">
          <label htmlFor="sortOrder" className="mr-3 font-semibold">
            Sort by Severity:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'highest' | 'lowest')}
            className="p-2 border border-stroke dark:border-strokedark rounded-md"
          >
            <option value="highest">Highest to Lowest</option>
            <option value="lowest">Lowest to Highest</option>
          </select>
        </div>

        {sensor.vulnerabilities.length > 0 ? (
          sensor.vulnerabilities.map((vulnGroup, groupIndex) => {
            const averageV3Score = calculateAverageV3Severity(vulnGroup.vulnerabilities);
            const gradientColor = calculateGradient(averageV3Score);

            return (
              <div key={groupIndex} className="mt-5">
                <div className="flex justify-between items-center">
                  <h5 className="font-semibold text-lg">
                    Source File: {vulnGroup.sourceFile}
                  </h5>
                  <button
                    onClick={() =>
                      setCvesVisible((prev) => ({
                        ...prev,
                        [groupIndex]: !prev[groupIndex],
                      }))
                    }
                    className="text-blue-500 underline"
                  >
                    {cvesVisible[groupIndex] ? "Hide CVEs" : "Show CVEs"}
                  </button>
                </div>
                {cvesVisible[groupIndex] && (
                  <div
                    className="rounded-lg p-4 mt-3 shadow-md transition-all"
                    style={{ background: gradientColor }}
                  >
                    {vulnGroup.vulnerabilities.length > 0 ? (
                      getSortedVulnerabilities(vulnGroup.vulnerabilities).map((vulnerability, vIndex) => {
                        const cvssMetricsV2 = vulnerability.cve?.metrics?.cvssMetricV2?.[0]?.cvssData;
                        const cvssMetricsV31 = vulnerability.cve?.metrics?.cvssMetricV31?.[0]?.cvssData;

                        return (
                          <div
                            key={`${groupIndex}-vuln-${vIndex}`}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4"
                          >
                            <h6 className="text-md font-bold mb-1 text-gray-700 dark:text-gray-300">
                              {vulnerability.cve?.id || "No CVE ID Available"}
                            </h6>

                            {/* CVSS V2 Metrics */}
                            {cvssMetricsV2 ? (
                              <div className="text-sm mb-3">
                                <h6 className="font-semibold">CVSS V2 Metrics:</h6>
                                <p>
                                  <strong>Base Score:</strong> {cvssMetricsV2.baseScore ?? "N/A"}<br />
                                  <strong>Base Severity:</strong> {cvssMetricsV2.baseSeverity ?? "N/A"}<br />
                                  <strong>Exploitability Score:</strong> {cvssMetricsV2.exploitabilityScore ?? "N/A"}<br />
                                  <strong>Impact Score:</strong> {cvssMetricsV2.impactScore ?? "N/A"}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm mb-3">No CVSS V2 metrics available</p>
                            )}

                            {/* CVSS V3.1 Metrics */}
                            {cvssMetricsV31 ? (
                              <div className="text-sm mb-3">
                                <h6 className="font-semibold">CVSS V3.1 Metrics:</h6>
                                <p>
                                  <strong>Base Score:</strong> {cvssMetricsV31.baseScore ?? "N/A"}<br />
                                  <strong>Base Severity:</strong> {cvssMetricsV31.baseSeverity ?? "N/A"}<br />
                                  <strong>Exploitability Score:</strong> {cvssMetricsV31.exploitabilityScore ?? "N/A"}<br />
                                  <strong>Impact Score:</strong> {cvssMetricsV31.impactScore ?? "N/A"}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm mb-3">No CVSS V3.1 metrics available</p>
                            )}

                            {/* Source Identifier */}
                            <div className="text-sm mb-2">
                              <strong>Source Identifier:</strong> {vulnerability.cve?.sourceIdentifier ?? "N/A"}
                            </div>

                            {/* Descriptions */}
                            <div className="text-sm mb-2">
                              <h6 className="font-semibold">Descriptions:</h6>
                              {vulnerability.cve?.descriptions?.length > 0 ? (
                                vulnerability.cve.descriptions.map((desc, descIndex) => (
                                  <p key={`${vIndex}-desc-${descIndex}`} className="text-sm">
                                    {desc.lang === "en" && desc.value}
                                  </p>
                                ))
                              ) : (
                                <p>No descriptions available</p>
                              )}
                            </div>

                            {/* References */}
                            <div className="text-sm mb-2">
                              <h6 className="font-semibold">
                                References:{" "}
                                <button
                                  onClick={() =>
                                    setReferencesVisible((prev) => ({
                                      ...prev,
                                      [`${groupIndex}-${vIndex}`]: !prev[`${groupIndex}-${vIndex}`],
                                    }))
                                  }
                                  className="text-blue-500 underline"
                                >
                                  {referencesVisible[`${groupIndex}-${vIndex}`] ? "Hide" : "Show"}
                                </button>
                              </h6>
                              {referencesVisible[`${groupIndex}-${vIndex}`] &&
                                (vulnerability.cve?.references?.length > 0 ? (
                                  vulnerability.cve.references.map((ref, refIndex) => (
                                    <p key={`${vIndex}-ref-${refIndex}`} className="text-blue-400 underline">
                                      <a href={ref.url} target="_blank" rel="noopener noreferrer">
                                        {ref.source ?? ref.url}
                                      </a>
                                    </p>
                                  ))
                                ) : (
                                  <p>No references available</p>
                                ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No vulnerabilities available for this source file</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No vulnerabilities available for this sensor</p>
        )}
      </div>
    </div>
  );
};

export default TableOne;
