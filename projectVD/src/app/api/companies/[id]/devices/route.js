import clientPromise from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Received company ID for devices:", id);

    // Validate the company ID format
    if (!ObjectId.isValid(id)) {
      console.error("Invalid company ID format:", id);
      return new Response(
        JSON.stringify({ error: "Invalid company ID format" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db("projectv");

    // Debug: Fetch and log all sensors (temporary for debugging)
    const allSensors = await db.collection("sensors").find({}).toArray();
    console.log("All sensors in collection:", allSensors);

    // Fetch devices by companyId in the sensors collection
    const devices = await db.collection("sensors").find({
      companyId: new ObjectId(id)
    }).toArray();

    // Debug: Log the filtered devices result
    console.log("Fetched devices for company ID:", devices);

    return new Response(JSON.stringify(devices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("Error fetching devices:", e.message);
    return new Response(
      JSON.stringify({ error: "Unable to fetch devices", details: e.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
