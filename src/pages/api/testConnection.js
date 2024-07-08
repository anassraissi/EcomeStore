import dbConnect from "../../../lib/mongodb";

// pages/api/testConnection.js
export default async function handler(req, res) {
  await dbConnect();

  res.status(200).json({ message: 'Connected to MongoDB successfully' });
}