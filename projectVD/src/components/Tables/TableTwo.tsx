import { FC, useEffect, useState } from "react";

interface Program {
  Name: string;
  Version: string;
}

interface Sensor {
  deviceName: string; // Updated to use deviceName instead of sensorId
}

interface TableTwoProps {
  sensor: Sensor;
  programs: Array<Program>;
}

const TableTwo: FC<TableTwoProps> = ({ sensor, programs }) => {
  const [programsVisible, setProgramsVisible] = useState<boolean>(true);

  useEffect(() => {
    console.log("Sensor Data:", sensor);
    console.log("Filtered Programs in TableTwo:", programs); // Verify that the programs are being passed correctly
  }, [sensor, programs]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Device Name: {sensor ? sensor.deviceName : "Loading..."} {/* Changed to show deviceName */}
      </h4>

      {/* Toggle Button to Show/Hide Programs */}
      <button
        onClick={() => setProgramsVisible(!programsVisible)}
        className="text-blue-500 underline mb-4"
      >
        {programsVisible ? "Hide Programs" : "Show Programs"}
      </button>

      {/* Programs List */}
      {programsVisible && programs && programs.length > 0 ? (
        <div className="flex flex-col gap-4">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4"
            >
              <h6 className="text-md font-bold text-gray-700 dark:text-gray-300">
                {program.Name}
              </h6>
              <p className="mt-2 text-sm">
                <strong>Version:</strong> {program.Version}
              </p>
            </div>
          ))}
        </div>
      ) : programsVisible ? (
        <p>No programs available for this device</p>
      ) : null}
    </div>
  );
};

export default TableTwo;
