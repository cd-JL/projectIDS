import clientPromise from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Received company ID for programs:", id);

    if (!ObjectId.isValid(id)) {
      console.error("Invalid company ID format:", id);
      return new Response(
        JSON.stringify({ error: "Invalid company ID format" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db("projectv");

    const programs = await db.collection("sensors").aggregate([
      { $match: { companyId: new ObjectId(id) } },
      {
        $lookup: {
          from: "programs",
          localField: "sensorId",
          foreignField: "sensorId",
          as: "programsData"
        }
      },
      {
        $addFields: {
          programs: { $ifNull: [{ $arrayElemAt: ["$programsData.programs", 0] }, []] }
        }
      },
      {
        $project: {
          sensorId: 1,
          programs: 1
        }
      }
    ]).toArray();

    return new Response(JSON.stringify(programs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("Error fetching programs:", e);
    return new Response(
      JSON.stringify({ error: "Unable to fetch programs" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
