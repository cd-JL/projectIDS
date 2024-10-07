import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    console.log("Received company ID:", id);

    const client = await clientPromise;
    const db = client.db("projectv");

    // Step 1: Find all sensors for the given company
    const sensors = await db.collection("sensors").find({ companyId: new ObjectId(id) }).toArray();
    console.log("Sensors found for company:", sensors);

    // Step 2: Extract sensor IDs as strings
    const sensorIds = sensors.map(sensor => sensor.sensorId);
    console.log("Sensor IDs extracted:", sensorIds); // Log sensor IDs to check format

    // Step 3: Fetch vulnerabilities for all sensor IDs
    const vulnerabilitiesData = await db
      .collection("vulnerabilities")
      .find({ sensorId: { $in: sensorIds } })
      .toArray();

    // Step 4: Fetch programs for all sensor IDs
    const programsData = await db
      .collection("programs")
      .find({ sensorId: { $in: sensorIds } })
      .toArray();

    console.log("Programs found for sensors:", programsData);

    // Additional debugging for the programsData to check if sensorId matches
    programsData.forEach(program => {
      console.log(`Program ID: ${program._id}, Sensor ID in program: ${program.sensorId}, Match: ${sensorIds.includes(program.sensorId)}`);
    });

    // Step 5: Map vulnerabilities and programs to each corresponding sensor based on sensorId
    const sensorsWithDetails = sensors.map(sensor => {
      // Find programs for this sensor
      const sensorPrograms = programsData.find(prog => prog.sensorId === sensor.sensorId);

      // Find vulnerabilities for this sensor
      const sensorVulnerabilities = vulnerabilitiesData.filter(vuln => vuln.sensorId === sensor.sensorId);

      return {
        ...sensor,
        programs: sensorPrograms ? sensorPrograms.programs : [],
        vulnerabilities: sensorVulnerabilities || [],
      };
    });

    console.log("Final sensors with vulnerabilities and programs:", sensorsWithDetails);
    res.status(200).json(sensorsWithDetails);
  } catch (e) {
    console.error("Error fetching sensors, vulnerabilities, and programs:", e);
    res.status(500).json({ error: "Unable to fetch sensors, vulnerabilities, and programs" });
  }
}
