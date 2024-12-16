import { NextResponse } from "next/server";

export async function POST(req: Request) {

  type Place = {
    displayName: { text: string };
    types: string[];
    formattedAddress?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };

  try {
    const body = await req.json(); 
    const textQuery: string = body.textQuery;
    if (!textQuery || textQuery.trim().length < 2) {
      return NextResponse.json(
        { error: "Query too short", places: [] },
        { status: 200 }
      );
    }

    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const url = `https://places.googleapis.com/v1/places:searchText`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY || "",
        "X-Goog-FieldMask": "places.displayName,places.types,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "iw", 
        maxResultCount: 200, 
      }),
    });

    const data: { places?: Place[] } = await response.json();

    if (!data.places || data.places.length === 0) {
      return NextResponse.json(
        { message: "No results found", places: [] },
        { status: 200 }
      );
    }

      const formattedPlaces = data.places.map((place) => {
        const addressParts = place.formattedAddress?.split(",") || [];
        const city = addressParts.length >= 2 ? addressParts[addressParts.length - 2].trim() : "No city available";
        return {
          name: place.displayName.text,
          address: place.formattedAddress || "No address available",
          city: city,
        };
      });
      
    return NextResponse.json({ formattedPlaces: formattedPlaces }, { status: 200 });
  } 
  catch (error) {
    return NextResponse.json(
      { error: "Server error", places: [] },
      { status: 500 }
    );
  }
}
