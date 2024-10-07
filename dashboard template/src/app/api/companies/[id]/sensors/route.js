import clientPromise from '@lib/mongodb'; // Using the alias for simpler imports
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Received company ID:", id); // Log the received company ID

    const client = await clientPromise;
    const db = client.db("projectv");

    // Step 1: Find all sensors for the given company
    const sensors = await db.collection("sensors").find({ companyId: new ObjectId(id) }).toArray();
    console.log("Sensors found for company:", sensors); // Log sensors found

    // Step 2: For each sensor, find its vulnerabilities using `sensorId` as a string
    const sensorsWithVulnerabilities = await Promise.all(
      sensors.map(async (sensor) => {
        console.log("Fetching vulnerabilities for sensorId:", sensor.sensorId); // Log each sensorId being used

        const vulnerabilities = await db
          .collection("vulnerabilities")
          .find({ sensorId: sensor.sensorId })  // Querying with sensorId as a string
          .toArray();

        console.log(`Vulnerabilities found for sensorId ${sensor.sensorId}:`, vulnerabilities); // Log vulnerabilities found

        // Attach the vulnerabilities to the sensor object
        return {
          ...sensor,
          vulnerabilities,
        };
      })
    );

    console.log("Final sensors with vulnerabilities:", sensorsWithVulnerabilities); // Log the final result

    return new Response(JSON.stringify(sensorsWithVulnerabilities), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("Error fetching sensors and vulnerabilities:", e);
    return new Response(JSON.stringify({ error: "Unable to fetch sensors and vulnerabilities" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
