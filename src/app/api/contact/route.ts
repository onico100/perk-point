import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    // קבלת המידע מהבקשה
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // הגדרת השירות לשליחת אימייל עם Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // כתובת המייל שלך
        pass: process.env.EMAIL_PASS, // סיסמת אפליקציה (App Password)
      },
    });

    // פרטי ההודעה שתישלח אלייך
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // המייל שלך
      subject: "New Contact Form Submission",
      html: `
        <h3>התקבלה הודעת צור קשר</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>אימייל:</strong> ${email}</p>
        <p><strong>הודעה:</strong> ${message}</p>
      `,
    };

    // שליחת האימייל
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
