import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import nodemailer from "nodemailer";

type UpdateClubFormRequestBody = {
    status?: string;
    isActive?: boolean;
};

const uri = process.env.PUBLIC_DB_CONNECTION!;
const client = new MongoClient(uri);
const logoUrl = "https://perk-point.vercel.app/_next/static/media/logoLight.aaba116a.png";

async function sendEmails(email: string, clubName: string, clubLink: string, clubLogo: string, route: string | undefined, comments: string | undefined, isApi: boolean) {    
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
        subject: "בקשה לרישום מועדון חדש",
        html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.5; text-align: right;">
            <img src="${logoUrl}" alt="לוגו" style="max-width: 150px; margin-bottom: 20px;" />
            <h3 style="color:rgb(119, 13, 96); margin-bottom: 10px;">בקשה לרישום מועדון חדש</h3>
            <p><strong>שם המועדון:</strong> ${clubName}</p>
            <p><strong>קישור:</strong> ${clubLink}</p>
            <p><strong>קישור ללוגו:</strong> ${clubLogo || "לא צורף לוגו."}</p>
            ${isApi ? `<p><strong>ניתוב:</strong> ${route}</p>` : ""}
            <p><strong>הערות:</strong> ${comments || "אין הערות."}</p>
            <p><strong>אימייל:</strong> <a href="mailto:${email}">${email}</a></p>
            <p>נשלח ב: ${new Date().toLocaleString("he-IL")}</p>
        </div>
        `,
    };

    const mailOptionsToUser = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "בבקשתך להוספת מועדון התקבלה",
        html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.5; text-align: right;">
            <img src="${logoUrl}" alt="Logo" style="max-width: 150px; margin-bottom: 20px;" />
            <h2 style="color:rgb(119, 13, 96);">בקשתך התקבלה!</h2>
            <p>תודה רבה על הרצון לחבר את המועדון שלך. <strong>${clubName}</strong>.</p>
            <p>הצוות שלנו יעבור על הבקשה שלך ויהיה בקשר איתך תוך שבוע..</p>
            <p><strong>פרטים:</strong></p>
            <p>קישור: ${clubLink}</p>
            <p><strong> ללוגו:</strong></p>
            <img src="${clubLogo}" alt="לא צורף לוגו." style="max-width: 150px; margin-bottom: 20px;" />
            ${isApi ? `<p>ניתוב: ${route}</p>` : ""}
            <p><strong>הערות:</strong> ${comments || "אין הערות."}</p>  
            <br />
            <p>תודה רבה,<br /><strong>צוות PerkPoint</strong></p>
        </div>
        `,
    };

    await transporter.sendMail(mailOptionsToSite);
    await transporter.sendMail(mailOptionsToUser);

}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, clubName, clubLink, clubLogo, route, comments, email } = body;
        const db = client.db("benefits-site");
        const collection = db.collection("contact_addClub_collection");


        if (action == "submit") {
            try {
                if (!clubName || !clubLink || !email) {
                    return NextResponse.json(
                        { message: "חסר שדה." },
                        { status: 400 }
                    );
                }

                const isApi = route !== undefined;

                if (isApi && !route) {
                    return NextResponse.json(
                        { message: "חסר ניתוב" },
                        { status: 400 }
                    );
                }

                const contactData = {
                    clubName,
                    clubLink,
                    clubLogo,
                    ...(isApi && { route }),
                    comments,
                    email,
                    createdAt: new Date().toISOString(),
                    isActive: true,
                    status: "received"
                };
                await collection.insertOne(contactData);
                await sendEmails(email, clubName, clubLink, clubLogo, route, comments, isApi);
                return NextResponse.json({
                    message: "Request submitted successfully!",
                });
            } catch (error) {
                console.error("Error:", error);
                return NextResponse.json(
                    { message: "Internal Server Error", error },
                    { status: 500 }
                );
            }
        } else if (action == "fetch") {
            try {
                const forms = await collection.find({ isActive: true }).toArray();
                return NextResponse.json({ data: forms });
            } catch (error) {
                console.error("Error fetching Add club forms:", error);
                return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
            }
        }
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body: { status?: string; isActive?: boolean } = await request.json();
        const db = client.db("benefits-site");
        const collection = db.collection("contact_addClub_collection");


        const updateData: Partial<UpdateClubFormRequestBody> = {}; // Ensure updateData is correctly typed
        if (body.status !== undefined)
            updateData.status = body.status;
        if (body.isActive !== undefined)
            updateData.isActive = body.isActive;


        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isActive: false } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Add club not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Add club form marked as inactive" });
    } catch (error) {
        console.error("Error deleting Add club form:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


