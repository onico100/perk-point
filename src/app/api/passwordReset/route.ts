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

    const resetLink = `http://localhost:3000/passwordReset?email=${encodeURIComponent(email)}&role=${role}`;
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "איפוס סיסמה",
    //   text: `לחץ על הקישור הבא לאיפוס הסיסמה: ${resetLink}`,
    // };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "איפוס סיסמה",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.5; text-align: right; color: #333;">
          <h2 style="color: #4caf50;">בקשת איפוס סיסמה</h2>
          <p>שלום רב,</p>
          <p>קיבלנו בקשה לאיפוס סיסמה. לחץ על הקישור הבא כדי לאפס את הסיסמה שלך:</p>
          <p style=" margin: 20px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; background-color: #4caf50; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
              איפוס סיסמה
            </a>
          </p>
          <p>אם לא שלחת בקשה זו, אין צורך לעשות דבר.</p>
          <br />
          <p style="font-size: 0.9rem; color: #555;">תודה,<br />צוות האתר</p>
        </div>
      `,
    };
    

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "איפוס סיסמה",
    //   html: `
    //     <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: right;">
    //       <h2 style="color: #4caf50; margin-bottom: 10px; text-align: center;">בקשת איפוס סיסמה</h2>
    //       <p>שלום רב,</p>
    //       <p>קיבלנו בקשה לאיפוס סיסמה. אם אכן שלחת בקשה זו, לחץ על הקישור הבא כדי לאפס את הסיסמה שלך:</p>
    //       <div style="text-align: center; margin: 20px 0;">
    //         <a href="${resetLink}" 
    //           style="
    //             display: inline-block; 
    //             padding: 10px 20px; 
    //             color: white; 
    //             background-color: #4caf50; 
    //             text-decoration: none; 
    //             border-radius: 5px;
    //             font-weight: bold;
    //           ">
    //           איפוס סיסמה
    //         </a>
    //       </div>
    //       <p>אם לא שלחת בקשה זו, אין צורך לעשות דבר. אנו ממליצים לשמור על סיסמתך בטוחה.</p>
    //       <br />
    //       <p style="font-size: 0.9rem; color: #555;">תודה,<br />צוות האתר</p>
    //     </div>
    //   `,
    // };

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
