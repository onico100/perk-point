import my_http from "@/services/http";
import { Branch } from "@/types/types";

export async function getbranchesByBusinessName(textQuery:string): Promise<Branch[]> {
    try {
        const response = await my_http.post(`/googleAutocomplete/post`, {
          textQuery,
          country: "IL",
        });
        const branchesFromGoogle = response.data.formattedPlaces;

        const extractCity = (branch: string): string => {
          const parts = branch.split(",");
          return parts.length >= 2 ? parts[1].trim() : "לא ידועה";
        };

        const citySuggestions: Branch[] = branchesFromGoogle
          ? branchesFromGoogle.map((place: any) => {
              return {
                nameBranch: place.name + " " + place.address,
                city: extractCity(place.address),
              } as Branch;
            })
          : [];

        return citySuggestions;
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        throw error;
      }
}