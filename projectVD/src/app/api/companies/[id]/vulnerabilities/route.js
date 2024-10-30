import clientPromise from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Received company ID:", id); // Debug

    // Validate the company ID format
    if (!ObjectId.isValid(id)) {
      console.error("Invalid company ID format:", id); // Debug
      return new Response(
        JSON.stringify({ error: "Invalid company ID format" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db("projectv");

    // Log database connection
    console.log("Connected to MongoDB, attempting to fetch vulnerabilities"); // Debug

    // Perform the aggregation query to retrieve vulnerabilities
    const vulnerabilities = await db.collection("sensors").aggregate([
      { $match: { companyId: new ObjectId(id) } },
      {
        $lookup: {
          from: "vulnerabilities",
          localField: "sensorId",
          foreignField: "sensorId",
          as: "vulnerabilities"
        }
      },
      {
        $project: {
          sensorId: 1,
          vulnerabilities: 1
        }
      }
    ]).toArray();

    // Log the results of the query
    console.log("Fetched vulnerabilities:", vulnerabilities); // Debug

    return new Response(JSON.stringify(vulnerabilities), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("Error fetching vulnerabilities:", e.message); // Debug
    return new Response(
      JSON.stringify({ error: "Unable to fetch vulnerabilities", details: e.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
