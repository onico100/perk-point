import { connectDatabase, insertDocument } from "@/services/mongo";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  let client;
  console.log("request: ", request);
  try {
    client = await connectDatabase();
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }

    const data = await request.json();

    const result = await insertDocument(client, "clubs_collection", data);

    const insertedId = result.insertedId;
    data._id = insertedId;

    if (data.clubStatus === "ממתין") {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: data.email,
          subject: "המועדון שלך נוסף למערכת",
          html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.5; text-align: right;">
            <h2 style="color:rgb(119, 13, 96);">המועדון שלך נוסף בהצלחה!</h2>
            <p>שלום,</p>
            <p>בהמשך לפנייתך להוספת מועדון  <strong>${data.clubName}</strong> רצינו לעדכן כי אנו מטפלים בבקשתך.</p>
            <p><strong>להלן מזהה המועדון שלך אצלנו עבור שליחת API :</strong> ${insertedId}</p>
            <p>תודה רבה, <br> צוות PerkPoint</p>
          </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", data.email);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ insertedId });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
