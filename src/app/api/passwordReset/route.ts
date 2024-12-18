import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDatabase } from "@/services/mongo";

export async function POST(request: NextRequest) {
  let client;
  try {
    client = await connectDatabase();
    const db = client.db("benefits-site");

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await db.collection("users_collection").findOne({ email });
    const supplier = await db.collection("suppliers_collection").findOne({ email });

    if (!user && !supplier) {
      return NextResponse.json(
        { success: false, message: "User or supplier not found" },
        { status: 404 }
      );
    }

    const role = user ? "user" : "supplier";

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/passwordReset?email=${email}&role=${role}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "איפוס סיסמה",
      text: `לחץ על הקישור הבא לאיפוס הסיסמה: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
