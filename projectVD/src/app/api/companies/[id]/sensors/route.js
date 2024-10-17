import clientPromise from '@lib/mongodb'; // Using the alias for simpler imports
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Received company ID:", id);

    const client = await clientPromise;
    const db = client.db("projectv");

    // Step 1: Find all sensors for the given company
    const sensors = await db.collection("sensors").find({ companyId: new ObjectId(id) }).toArray();
    console.log("Sensors found for company:", sensors);

    // Step 2: For each sensor, find its vulnerabilities and programs
    const sensorsWithDetails = await Promise.all(
      sensors.map(async (sensor) => {
        console.log("Fetching vulnerabilities and programs for device:", sensor.deviceName);

        // Fetch vulnerabilities for the sensor
        const vulnerabilities = await db
          .collection("vulnerabilities")
          .find({ sensorId: sensor.sensorId }) // sensorId is still used to link vulnerabilities
          .toArray();

        // Fetch programs for the sensor
        const programsData = await db
          .collection("programs")
          .findOne({ sensorId: sensor.sensorId }); // sensorId is still used to link programs

        const programs = programsData ? programsData.programs : [];

        console.log(`Vulnerabilities found for device ${sensor.deviceName}:`, vulnerabilities);
        console.log(`Programs found for device ${sensor.deviceName}:`, programs);

        // Attach both vulnerabilities and programs to the sensor object
        return {
          ...sensor,
          vulnerabilities,
          programs,
        };
      })
    );

    console.log("Final sensors with vulnerabilities and programs:", sensorsWithDetails);

    return new Response(JSON.stringify(sensorsWithDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("Error fetching sensors, vulnerabilities, and programs:", e);
    return new Response(JSON.stringify({ error: "Unable to fetch sensors, vulnerabilities, and programs" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
