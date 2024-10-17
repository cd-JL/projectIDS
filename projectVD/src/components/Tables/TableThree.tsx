import { FC } from "react";

interface Sensor {
  _id: string; // Sensor ID
  deviceName?: string; // Optional device name
  active: boolean; // Indicator for active/inactive status
}

interface TableThreeProps {
  sensors: Array<Sensor>;
}

const TableThree: FC<TableThreeProps> = ({ sensors }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Devices
      </h4>

      {/* Devices List with Status Indicators */}
      {sensors && sensors.length > 0 ? (
        <div className="flex flex-col gap-4">
          {sensors.map((sensor, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4"
            >
              <h6 className="text-md font-bold text-gray-700 dark:text-gray-300">
                {sensor.deviceName || `Sensor ID: ${sensor._id}`} {/* Use deviceName or fallback to sensor ID */}
              </h6>
              <span
                className={`h-4 w-4 rounded-full ${
                  sensor.active ? "bg-green-500" : "bg-red-500"
                }`}
                title={sensor.active ? "Active" : "Inactive"}
              ></span>
            </div>
          ))}
        </div>
      ) : (
        <p>No devices available</p>
      )}
    </div>
  );
};

export default TableThree;
