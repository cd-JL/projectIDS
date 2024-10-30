import clientPromise from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Received company ID for ports:", id);

    if (!ObjectId.isValid(id)) {
      console.error("Invalid company ID format:", id);
      return new Response(
        JSON.stringify({ error: "Invalid company ID format" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db("projectv");

    const ports = await db.collection("sensors").aggregate([
      { $match: { companyId: new ObjectId(id) } },
      {
        $lookup: {
          from: "ports",
          localField: "sensorId",
          foreignField: "sensorId",
          as: "services"
        }
      },
      {
        $project: {
          sensorId: 1,
          services: 1
        }
      }
    ]).toArray();

    return new Response(JSON.stringify(ports), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("Error fetching ports:", e);
    return new Response(
      JSON.stringify({ error: "Unable to fetch ports" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
