import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("1----- POST /googleAutocomplete");

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
    const body = await req.json(); // קרא את ה-Body פעם אחת ושמור אותו במשתנה
    console.log("2----- POST /googleAutocomplete", body);

    const textQuery: string = body.textQuery;
    console.log("3----- POST /googleAutocomplete", textQuery);

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
        //"X-Goog-FieldMask": "places.formattedAddress",
        "X-Goog-FieldMask": "places.displayName,places.types,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "iw", 
        maxResultCount: 100, 
        //locationBias: { radiusMeters: 50000 }, // רדיוס סביב מיקום
      }),
    });

    const data: { places?: Place[] } = await response.json();

    if (!data.places || data.places.length === 0) {
      return NextResponse.json(
        { message: "No results found", places: [] },
        { status: 200 }
      );
    }

    console.log("-------" , data.places)


    const filteredPlaces = data.places
      .filter((place) =>
        place.types.some((type) =>
          ["locality", "administrative_area_level_1", "administrative_area_level_2"].includes(type)
        )
      )
      .filter((place, index, self) =>
        index === self.findIndex((p) => p.displayName.text === place.displayName.text)
      );

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
    console.log("Places API error:", error);
    return NextResponse.json(
      { error: "Server error", places: [] },
      { status: 500 }
    );
  }
}
