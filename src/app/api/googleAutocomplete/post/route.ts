import { NextResponse } from "next/server";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(req: any) {


  try {
    const body = await req.json();
    const textQuery = body.textQuery;
    console.log('textQuery', textQuery);

    if (!textQuery) {
      return NextResponse.json(
        { error: "Missing textQuery parameter" },
        { status: 400 }
      );
    }

    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const url = `https://places.googleapis.com/v1/places:searchText`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY || "",
        //"X-Goog-FieldMask": "*", 
        "X-Goog-FieldMask": "places.displayName,places.types",
      },
      body: JSON.stringify({ textQuery, languageCode: "iw" }),
    });

    // if (!response.ok) {
    //   const errorDetails = await response.json();
    //   return NextResponse.json(
    //     { error: "Error from Google API", details: errorDetails },
    //     { status: response.status }
    //   );
    // }

    const data = await response.json();

    const filteredPlaces = data.places.filter((place: any) => place.types.includes("locality"));

    return NextResponse.json({ places: filteredPlaces }, { status: 200 });



  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
