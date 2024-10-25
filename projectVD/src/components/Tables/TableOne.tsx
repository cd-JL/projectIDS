// TableOne.tsx

import React, { FC, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

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
        };
        baseSeverity?: string;
        exploitabilityScore?: number;
        impactScore?: number;
      }>;
      cvssMetricV31?: Array<{
        cvssData?: {
          baseScore?: number;
        };
        baseSeverity?: string;
        exploitabilityScore?: number;
        impactScore?: number;
      }>;
    };
  };
}

interface VulnerabilityData {
  vulnerabilities: Vulnerability[];
}

interface Sensor {
  sensorId: string;
  vulnerabilities: Array<{
    product: string;
    vendor: string;
    version: string;
    vulnerabilityData: VulnerabilityData;
    sourceFile: string;
  }>;
}

interface TableOneProps {
  sensor: Sensor;
}

const TableOne: FC<TableOneProps> = ({ sensor }) => {
  const [cvesVisible, setCvesVisible] = useState<{ [key: number]: boolean }>({});
  const [referencesVisible, setReferencesVisible] = useState<{ [key: string]: boolean }>({});
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getHighestBaseScore = (vulnerability: Vulnerability) => {
    const scoreV2 = vulnerability?.cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;
    const scoreV3 = vulnerability?.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
    return Math.max(scoreV2, scoreV3);
  };

  const getSeverityColor = (score: number) => {
    if (score >= 9) return 'bg-red-600';
    if (score >= 7) return 'bg-orange-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const sortedVulnerabilities = (vulnerabilities: Vulnerability[]) => {
    return vulnerabilities.slice().sort((a, b) => {
      const scoreA = getHighestBaseScore(a);
      const scoreB = getHighestBaseScore(b);
      return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        Sensor ID: {sensor.sensorId}
      </h2>

      {/* Sorting Controls */}
      <div className="mb-4">
        <label htmlFor="sortOrder" className="mr-2 dark:text-white">
          Sort by Severity:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="desc">Highest to Lowest</option>
          <option value="asc">Lowest to Highest</option>
        </select>
      </div>

      {sensor.vulnerabilities.length > 0 ? (
        sensor.vulnerabilities.map((vulnGroup, groupIndex) => {
          const vulnerabilities = vulnGroup.vulnerabilityData.vulnerabilities || [];

          // Calculate total severity score and number of vulnerabilities
          const totalSeverityScore = vulnerabilities.reduce((total, vuln) => {
            return total + getHighestBaseScore(vuln);
          }, 0);

          const numOfVulnerabilities = vulnerabilities.length;

          // Sort vulnerabilities based on severity
          const sortedVulns = sortedVulnerabilities(vulnerabilities);

          return (
            <div key={groupIndex} className="mb-6">
              <button
                onClick={() =>
                  setCvesVisible((prev) => ({
                    ...prev,
                    [groupIndex]: !prev[groupIndex],
                  }))
                }
                className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-lg font-medium dark:text-white">
                  {vulnGroup.vendor} {vulnGroup.product} {vulnGroup.version}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm dark:text-white">
                    Total Severity Score: {totalSeverityScore.toFixed(1)}
                  </span>
                  <span className="text-sm dark:text-white">
                    Vulnerabilities: {numOfVulnerabilities}
                  </span>
                  {cvesVisible[groupIndex] ? (
                    <ChevronUpIcon className="w-5 h-5 dark:text-white" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 dark:text-white" />
                  )}
                </div>
              </button>
              {cvesVisible[groupIndex] && (
                <div className="mt-4">
                  {sortedVulns.length > 0 ? (
                    sortedVulns.map((vulnerability, vIndex) => {
                      const score = getHighestBaseScore(vulnerability);
                      const severityColor = getSeverityColor(score);

                      const cvssMetricsV2 = vulnerability.cve?.metrics?.cvssMetricV2?.[0];
                      const cvssMetricsV31 = vulnerability.cve?.metrics?.cvssMetricV31?.[0];

                      const referenceKey = `${groupIndex}-${vIndex}`;

                      return (
                        <div
                          key={vIndex}
                          className={`p-4 mb-4 rounded-lg ${severityColor} text-white`}
                        >
                          {/* Improve text readability */}
                          <div className="text-black">
                            <h3 className="text-xl font-semibold">
                              {vulnerability.cve?.id || 'No CVE ID Available'}
                            </h3>
                            <p className="mt-2">
                              <strong>Source Identifier:</strong>{' '}
                              {vulnerability.cve?.sourceIdentifier ?? 'N/A'}
                            </p>
                            <div className="mt-2">
                              <strong>Description:</strong>{' '}
                              {vulnerability.cve?.descriptions?.find(
                                (desc) => desc.lang === 'en'
                              )?.value || 'No description available'}
                            </div>
                            {/* CVSS Metrics V2 */}
                            {cvssMetricsV2 && (
                              <div className="mt-2">
                                <strong>CVSS Metrics V2:</strong>
                                <ul className="list-disc pl-5">
                                  <li>
                                    <strong>Base Score:</strong>{' '}
                                    {cvssMetricsV2.cvssData?.baseScore ?? 'N/A'}
                                  </li>
                                  <li>
                                    <strong>Base Severity:</strong>{' '}
                                    {cvssMetricsV2.baseSeverity ?? 'N/A'}
                                  </li>
                                  <li>
                                    <strong>Exploitability Score:</strong>{' '}
                                    {cvssMetricsV2.exploitabilityScore ?? 'N/A'}
                                  </li>
                                  <li>
                                    <strong>Impact Score:</strong>{' '}
                                    {cvssMetricsV2.impactScore ?? 'N/A'}
                                  </li>
                                </ul>
                              </div>
                            )}
                          {/* CVSS Metrics V3.1 */}
                            {cvssMetricsV31 && (
                              <div className="mt-2">
                                <strong>CVSS Metrics V3.1:</strong>
                                <ul className="list-disc pl-5">
                                  <li>
                                    <strong>Base Score:</strong>{' '}
                                    {cvssMetricsV31.cvssData?.baseScore ?? 'N/A'}
                                  </li>
                                  <li>
                                    <strong>Base Severity:</strong>{' '}
                                    {cvssMetricsV31.cvssData?.baseSeverity ?? 'N/A'}
                                  </li>
                                  <li>
                                    <strong>Exploitability Score:</strong>{' '}
                                    {cvssMetricsV31.cvssData?.exploitabilityScore ?? 'N/A'}
                                  </li>
                                  <li>
                                    <strong>Impact Score:</strong>{' '}
                                    {cvssMetricsV31.cvssData?.impactScore ?? 'N/A'}
                                  </li>
                                </ul>
                              </div>
                              )}

                            {/* References with Dropdown */}
                            <div className="mt-2">
                              <button
                                onClick={() =>
                                  setReferencesVisible((prev) => ({
                                    ...prev,
                                    [referenceKey]: !prev[referenceKey],
                                  }))
                                }
                                className="text-blue-500 underline"
                              >
                                {referencesVisible[referenceKey] ? 'Hide References' : 'Show References'}
                              </button>
                              {referencesVisible[referenceKey] &&
                                (vulnerability.cve?.references?.length > 0 ? (
                                  <div className="mt-2">
                                    <strong>References:</strong>
                                    <ul className="list-disc pl-5">
                                      {vulnerability.cve.references.map((ref, refIndex) => (
                                        <li key={refIndex}>
                                          <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline text-blue-600"
                                          >
                                            {ref.source || ref.url}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : (
                                  <p>No references available</p>
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      No vulnerabilities available for this product.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          No vulnerabilities available for this sensor.
        </p>
      )}
    </div>
  );
};

export default TableOne;
