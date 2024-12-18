import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

const uri = process.env.PUBLIC_DB_CONNECTION!;
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
  try {
    const { name, email, messageContent } = await request.json();
    if (!name || !email || !messageContent) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }


    const db = client.db("benefits-site");
    const collection = db.collection("contact_forms_collection");


    const lastContact = await collection
      .find({})
      .sort({ serialNumber: -1 })
      .limit(1)
      .toArray(); 

    const lastSerialNumber = lastContact.length > 0 ? lastContact[0].serialNumber : 999;
    const newSerialNumber = lastSerialNumber + 1;

    const contactData = {
      serialNumber: newSerialNumber,
      name,
      email,
      messageContent,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    await collection.insertOne(contactData);


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const mailOptionsToSite = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "פנייה חדשה מהאתר",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: right;">
          <h3 style="color: #4caf50; margin-bottom: 10px;">התקבלה הודעת צור קשר</h3>
          <p><strong>מספר פנייה:</strong> ${newSerialNumber}</p>
          <p><strong>שם:</strong> ${name}</p>
          <p><strong>אימייל:</strong> <a href="mailto:${email}" style="color: #4a90e2;">${email}</a></p>
          <p><strong>הודעה:</strong></p>
          <div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            ${messageContent}
          </div>
          <br />
          <p style="font-size: 0.9rem; color: #555;">נשלח בתאריך: ${new Date().toLocaleString("he-IL")}</p>
        </div>
      `,
    };

    // שליחת מייל למשתמש
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "פנייתך התקבלה בהצלחה",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: right;">
          <h2 style="color: #4caf50;">פנייתך התקבלה בהצלחה!</h2>
          <p>שלום <strong>${name}</strong>,</p>
          <p>אנו מודים לך על פנייתך. מספר הפנייה שלך הוא: <strong>${newSerialNumber}</strong>.</p>
          <p>צוות האתר שלנו יעבור על הפנייה ויחזור אליך בהקדם האפשרי.</p>
          <p><strong>תוכן הפנייה שלך:</strong></p>
          <div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            ${messageContent}
          </div>
          <br />
          <p style="font-size: 0.9rem; color: #555;">נשלח בתאריך: ${new Date().toLocaleString("he-IL")}</p>
          <br />
          <p>תודה רבה,<br /><strong>צוות האתר</strong></p>
        </div>
      `,
    };


    await transporter.sendMail(mailOptionsToSite);
    await transporter.sendMail(mailOptionsToUser);

    return NextResponse.json({
      message: "Message sent and saved successfully!",
      serialNumber: newSerialNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
