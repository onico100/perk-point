import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import my_http from "@/services/http";
import { Benefit, Club, Supplier } from "@/types/types";
import {
  getApiClubs,
  getBenefitsClubsWithSupplierId,
} from "@/utils/clubsUtils";

export async function getAllBenefitsFormAll(): Promise<Benefit[]> {
  const dataBaseBenefits = await getAllBenefits(); // Fetch existing benefits from the database
  const clubsWithApi: Club[] = getApiClubs(); // Get club details
  const { suppliers } = useFetchSuppliers();
  const allApiBenefits: Benefit[] = [];
  if (suppliers)
    for (const club of clubsWithApi) {
      const clubBenefits = await fetchBenefits(club._id, club.clubRoute || ""); // Fetch benefits for the club
      const mappedBenefits = getBenefitsClubsWithSupplierId(
        clubBenefits,
        suppliers || []
      ); // Map the fetched benefits to the desired format

      // Assign the current club ID to all benefits and collect them
      mappedBenefits.forEach((benefit) => {
        benefit.clubId = club._id;
        allApiBenefits.push(benefit);
      });
    }

  // Combine database benefits with API benefits
  return [...dataBaseBenefits, ...allApiBenefits];
}

const fetchBenefits = async (clubId: string, route: string) => {
  try {
    const response = await fetch(`${route}/api/benefits?clubId=${clubId}`);
    if (!response.ok) {
      throw new Error(`Error fetching benefits: ${response.statusText}`);
    }
    const data: Benefit[] = await response.json();
    return data;
  } catch (err: any) {
    return err.message;
  }
};
export async function getAllBenefits(): Promise<Benefit[]> {
  try {
    const response = await my_http.post("/benefits/get");
    const allBenefits: Benefit[] = response.data.data;
    const activeBenefits = allBenefits.filter((benefit) => benefit.isActive);
    return activeBenefits;
  } catch (error) {
    console.error("Error fetching benefits:", error);
    throw error;
  }
}

export async function getBenefitsById(id: string): Promise<Benefit> {
  try {
    const response = await my_http.get(`/benefits/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching benefit with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteBenefitById(
  id: string
): Promise<{ message: string }> {
  try {
    const response = await my_http.delete(`/benefits/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting benefit with ID ${id}:`, error);
    throw error;
  }
}
export async function updateBenefitById(
  id: string,
  updatedData: any
): Promise<Benefit> {
  try {
    const response = await my_http.patch(`/benefits/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating benefit with ID ${id}:`, error);
    throw error;
  }
}

export async function addBenefit(newBenefit: Benefit): Promise<Benefit> {
  try {
    const response = await my_http.post("/benefits/insert", newBenefit);
    return response.data;
  } catch (error) {
    console.error("Error creating new benefit:", error);
    throw error;
  }
}
