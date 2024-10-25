import clientPromise from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Received company ID:", id);

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

    // Step: Use aggregation to combine sensors, vulnerabilities, programs, and services in a single query
    const sensorsWithDetails = await db.collection("sensors").aggregate([
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
        $lookup: {
          from: "programs",
          localField: "sensorId",
          foreignField: "sensorId",
          as: "programsData"
        }
      },
      {
        $lookup: {
          from: "ports",
          localField: "sensorId",
          foreignField: "sensorId",
          as: "services"
        }
      },
      {
        $addFields: {
          programs: { $ifNull: [{ $arrayElemAt: ["$programsData.programs", 0] }, []] },
          all_open_ports: { $ifNull: ["$all_open_ports", []] }
        }
      },
      {
        $project: {
          programsData: 0 // Exclude intermediate lookup results if not needed
        }
      }
    ]).toArray();

    //console.log("Final sensors with vulnerabilities, programs, services, and open ports:", sensorsWithDetails);

    return new Response(JSON.stringify(sensorsWithDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("Error fetching sensors, vulnerabilities, programs, services, and open ports:", e);
    return new Response(
      JSON.stringify({ error: "Unable to fetch sensors, vulnerabilities, programs, services, and open ports" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
