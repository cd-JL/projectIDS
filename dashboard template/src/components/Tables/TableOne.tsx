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
  const [cvesVisible, setCvesVisible] = useState<{ [key: string]: boolean }>({});
  const [sortOrder, setSortOrder] = useState<'highest' | 'lowest'>('highest');

  useEffect(() => {
    console.log("Sensor Data:", sensor);
  }, [sensor]);

  const getHighestBaseScore = (vulnerability: Vulnerability) => {
    const scoreV2 = vulnerability.cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;
    const scoreV3 = vulnerability.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
    return Math.max(scoreV2, scoreV3);
  };

  const getSortedVulnerabilities = (vulnerabilities: Vulnerability[]) => {
    return vulnerabilities.slice().sort((a, b) => {
      const scoreA = getHighestBaseScore(a);
      const scoreB = getHighestBaseScore(b);
      return sortOrder === 'highest' ? scoreB - scoreA : scoreA - scoreB;
    });
  };

  const calculateGradient = (score: number) => {
    if (score <= 5) {
      return `linear-gradient(135deg, rgba(0, 128, 0, 0.6) ${50 - score * 10}%, rgba(255, 165, 0, 0.6) ${score * 10}%)`;
    } else {
      return `linear-gradient(135deg, rgba(255, 165, 0, 0.6) ${(10 - score) * 10}%, rgba(255, 0, 0, 0.6) ${(score - 5) * 20}%)`;
    }
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
            const averageScore = vulnGroup.vulnerabilities.length > 0
              ? Math.max(...vulnGroup.vulnerabilities.map(getHighestBaseScore))
              : 0;
            const gradientColor = calculateGradient(averageScore);

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
                    className="rounded-lg p-4 mt-3 shadow-md text-black dark:text-white"
                    style={{ background: gradientColor }}
                  >
                    {vulnGroup.vulnerabilities.length > 0 ? (
                      getSortedVulnerabilities(vulnGroup.vulnerabilities).map((vulnerability, vIndex) => {
                        // Extract CVSS metrics V2 and V3.1
                        const cvssMetricsV2 = vulnerability.cve?.metrics?.cvssMetricV2?.[0]?.cvssData;
                        const cvssMetricsV31 = vulnerability.cve?.metrics?.cvssMetricV31?.[0]?.cvssData;

                        return (
                          <div
                            key={`${groupIndex}-vuln-${vIndex}`}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4"
                          >
                            <h6 className="text-md font-bold text-gray-700 dark:text-gray-300">
                              {vulnerability.cve?.id || "No CVE ID Available"}
                            </h6>

                            {/* Source Identifier */}
                            <p className="mt-2 text-sm">
                              <strong>Source Identifier:</strong> {vulnerability.cve?.sourceIdentifier ?? "N/A"}
                            </p>

                            {/* Descriptions */}
                            <div className="mt-2 text-sm">
                              <h6 className="font-semibold">Descriptions:</h6>
                              {vulnerability.cve?.descriptions?.length > 0 ? (
                                vulnerability.cve.descriptions.map((desc, descIndex) => (
                                  <p key={`${vIndex}-desc-${descIndex}`}>
                                    {desc.lang === "en" && desc.value}
                                  </p>
                                ))
                              ) : (
                                <p>No descriptions available</p>
                              )}
                            </div>

                            {/* References as a Dropdown */}
                            <div className="mt-2 text-sm">
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

                            {/* CVSS Metrics V2 */}
                            <div className="mt-2 text-sm">
                              <h6 className="font-semibold">CVSS Metrics V2:</h6>
                              {cvssMetricsV2 ? (
                                <>
                                  <p>
                                    <strong>Base Score:</strong> {cvssMetricsV2.baseScore ?? "N/A"}
                                  </p>
                                  <p>
                                    <strong>Base Severity:</strong> {vulnerability.cve?.metrics?.cvssMetricV2?.[0]?.baseSeverity ?? "N/A"}
                                  </p>
                                  <p>
                                    <strong>Exploitability Score:</strong> {vulnerability.cve?.metrics?.cvssMetricV2?.[0]?.exploitabilityScore ?? "N/A"}
                                  </p>
                                  <p>
                                    <strong>Impact Score:</strong> {vulnerability.cve?.metrics?.cvssMetricV2?.[0]?.impactScore ?? "N/A"}
                                  </p>
                                </>
                              ) : (
                                <p>No CVSS metrics V2 available</p>
                              )}
                            </div>

                            {/* CVSS Metrics V3.1 */}
                            <div className="mt-2 text-sm">
                              <h6 className="font-semibold">CVSS Metrics V3.1:</h6>
                              {cvssMetricsV31 ? (
                                <>
                                  <p>
                                    <strong>Base Score:</strong> {cvssMetricsV31.baseScore ?? "N/A"}
                                  </p>
                                  <p>
                                    <strong>Base Severity:</strong> {vulnerability.cve?.metrics?.cvssMetricV31?.[0]?.baseSeverity ?? "N/A"}
                                  </p>
                                  <p>
                                    <strong>Exploitability Score:</strong> {vulnerability.cve?.metrics?.cvssMetricV31?.[0]?.exploitabilityScore ?? "N/A"}
                                  </p>
                                  <p>
                                    <strong>Impact Score:</strong> {vulnerability.cve?.metrics?.cvssMetricV31?.[0]?.impactScore ?? "N/A"}
                                  </p>
                                </>
                              ) : (
                                <p>No CVSS metrics V3.1 available</p>
                              )}
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
