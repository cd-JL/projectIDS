// TableTwo.tsx

import React, { FC, useState } from 'react';

interface Program {
  Name: string;
  Version: string;
}

interface Sensor {
  deviceName: string;
}

interface TableTwoProps {
  sensor: Sensor;
  programs: Array<Program>;
}

const TableTwo: FC<TableTwoProps> = ({ sensor, programs }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = programs.filter((program) =>
    program.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.Version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        Device Name: {sensor.deviceName}
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Programs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
        />
      </div>

      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPrograms.map((program, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow"
            >
              <h3 className="text-lg font-medium dark:text-white">
                {program.Name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Version: {program.Version}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          No programs match your search.
        </p>
      )}
    </div>
  );
};

export default TableTwo;
