import { NextResponse } from "next/server";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

type Place = {
  name: string;
  id: string;
  types: string[];
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  googleMapsUri: string;
};

export async function POST(req: any) {
  try {
    const body = await req.json();
    const textQuery: string = body.textQuery;

    if (!textQuery) {
      return NextResponse.json(
        { error: "Missing textQuery parameter" },
        { status: 400 }
      );
    }

    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const url = `https://places.googleapis.com/v1/places:searchText`;

    let places: Place[] = [];
    let nextPageToken: string | null = null;

    do {
      const response: Response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY || "",
          "X-Goog-FieldMask": "places.displayName,places.types,places.formattedAddress", 
        },
        body: JSON.stringify({ textQuery, languageCode: "iw", pageToken: nextPageToken }),
      });
      

      const data: {
        places?: Place[];
        nextPageToken?: string;
      } = await response.json();

      if (data.places) {
        const filteredPlaces = data.places.filter((place) =>
          place.types.includes("locality")
        );
        places = [...places, ...filteredPlaces];
      }

      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);

    console.log('------------places:', places);

    if (places.length === 0) {
      return NextResponse.json(
        { message: "No results found matching your query." },
        { status: 200 }
      );
    }

    return NextResponse.json({ places }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
