import my_http from "@/services/http";
import {
  getApiClubs,
  getBenefitsClubsWithSupplierId,
} from "@/utils/clubsUtils";
import { getAllClubs } from "./clubsService";
import { Benefit, BenefitInput } from "@/types/BenefitsTypes";
import { Club } from "@/types/ClubTypes";
import { sortBenefitsByCounter } from "@/utils/benefitsUtils";
export async function getAllBenefitsFormAll(): Promise<Benefit[]> {
  const dataBaseBenefits = await getAllBenefits();
  const clubs = await getAllClubs();

  let clubsWithApi: Club[] = [];
  if (clubs && clubs.length > 0) {
    clubsWithApi = getApiClubs(clubs);
  } else {
    console.log("Error fetching clubs");
    return dataBaseBenefits;
  }

  const allApiBenefits: Benefit[] = [];

  const benefitsPromises = clubsWithApi.map(async (club) => {
    try {
      const clubBenefits = await fetchBenefits(
        club._id || " ",
        club.clubRoute || ""
      );
      const mappedBenefits = await getBenefitsClubsWithSupplierId(clubBenefits);

      return mappedBenefits.map((benefit) => ({
        ...benefit,
        clubId: club._id || " ",
      }));
    } catch (error) {
      console.error(
        `Failed to fetch benefits for club: ${club.clubName}. Error: ${error}`
      );
      return [];
    }
  });

  const benefitsResults = await Promise.allSettled(benefitsPromises);

  for (const result of benefitsResults) {
    if (result.status === "fulfilled") {
      allApiBenefits.push(...result.value);
    }
  }

  return sortBenefitsByCounter([...dataBaseBenefits, ...allApiBenefits]);
}

const fetchBenefits = async (
  clubId: string,
  route: string
): Promise<BenefitInput[]> => {
  try {
    const response = await fetch(`${route}/api/benefits?clubId=${clubId}`);
    if (!response.ok) {
      throw new Error(`Error fetching benefits: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(`Fetch error: ${error.message}`);
    throw error;
  }
};

export async function getAllBenefits(): Promise<Benefit[]> {
  try {
    const response = await my_http.post("/benefits/get");
    const allBenefits: Benefit[] = response.data.data;
    return allBenefits;
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

export async function increaseBenefit(
  id: string,
  isAPI: boolean
): Promise<Benefit> {
  try {
    const response = await my_http.patch(`/benefits/increaseCounter/${id}`, {
      isAPI: isAPI,
    });
    return response.data;
  } catch (error) {
    console.error(`Error increase benefit counter with ID ${id}:`, error);
    throw error;
  }
}
