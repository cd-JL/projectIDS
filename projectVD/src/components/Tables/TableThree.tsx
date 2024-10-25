// TableThree.tsx

import React, { FC } from 'react';

interface Sensor {
  _id: string;
  deviceName?: string;
  active: boolean;
}

interface TableThreeProps {
  sensors: Array<Sensor>;
}

const TableThree: FC<TableThreeProps> = ({ sensors }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Devices</h2>
      {sensors && sensors.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sensors.map((sensor, index) => (
            <div key={index} className="py-4 flex items-center justify-between">
              <span className="dark:text-white">
                {sensor.deviceName || `Sensor ID: ${sensor._id}`}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  sensor.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}
              >
                {sensor.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">No devices available.</p>
      )}
    </div>
  );
};

export default TableThree;
