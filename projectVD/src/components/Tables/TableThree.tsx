// TableThree.tsx

import React, { FC, useState } from 'react';

interface Sensor {
  _id: string;
  deviceName?: string;
  active: boolean;
}

interface TableThreeProps {
  sensors: Array<Sensor>;
}

interface ConnectionStatus {
  deviceId: string;
  status: 'idle' | 'connecting' | 'success' | 'error';
  message?: string;
}

const TableThree: FC<TableThreeProps> = ({ sensors }) => {
  const [connectionStatuses, setConnectionStatuses] = useState<{ [key: string]: ConnectionStatus }>({});

  const initiateConnection = async (deviceId: string) => {
    // Set connecting status
    setConnectionStatuses(prev => ({
      ...prev,
      [deviceId]: { deviceId, status: 'connecting' }
    }));

    try {
      const response = await fetch("http://localhost:8000/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setConnectionStatuses(prev => ({
          ...prev,
          [deviceId]: {
            deviceId,
            status: 'success',
            message: `Connected: ${data.sensorId}`
          }
        }));
      } else {
        setConnectionStatuses(prev => ({
          ...prev,
          [deviceId]: {
            deviceId,
            status: 'error',
            message: data.message || 'Connection failed'
          }
        }));
      }
    } catch (error) {
      setConnectionStatuses(prev => ({
        ...prev,
        [deviceId]: {
          deviceId,
          status: 'error',
          message: 'Failed to connect. Is the endpoint running?'
        }
      }));
    }

    // Clear status after 5 seconds
    setTimeout(() => {
      setConnectionStatuses(prev => {
        const newStatuses = { ...prev };
        delete newStatuses[deviceId];
        return newStatuses;
      });
    }, 5000);
  };

  const getConnectionButton = (sensor: Sensor) => {
    const status = connectionStatuses[sensor._id];

    if (status?.status === 'connecting') {
      return (
        <button
          disabled
          className="px-4 py-1 bg-blue-300 text-white rounded-lg flex items-center space-x-2"
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => initiateConnection(sensor._id)}
        className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        Connect
      </button>
    );
  };

  const getStatusMessage = (sensor: Sensor) => {
    const status = connectionStatuses[sensor._id];

    if (status) {
      return (
        <div
          className={`text-sm ${
            status.status === 'success'
              ? 'text-green-600'
              : status.status === 'error'
              ? 'text-red-600'
              : 'text-blue-600'
          }`}
        >
          {status.message}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Devices</h2>
      {sensors && sensors.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sensors.map((sensor, index) => (
            <div key={index} className="py-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="dark:text-white">
                  {sensor.deviceName || `Sensor ID: ${sensor._id}`}
                </span>
                {getStatusMessage(sensor)}
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    sensor.active
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {sensor.active ? 'Active' : 'Inactive'}
                </span>
                {getConnectionButton(sensor)}
              </div>
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