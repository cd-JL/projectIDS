// pages/api/companies/index.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("projectv");
    const companies = await db.collection("companies").find({}).toArray();

    res.status(200).json(companies);
  } catch (e) {
    res.status(500).json({ error: "Unable to fetch companies" });
  }
}