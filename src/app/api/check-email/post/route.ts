import { connectDatabase } from "@/services/mongo";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const client = await connectDatabase();
    const db = client.db("benefits-site");

    const userExists = await db.collection("users").findOne({ email });
    const supplierExists = await db.collection("suppliers").findOne({ email });

    client.close();

    if (userExists || supplierExists) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
