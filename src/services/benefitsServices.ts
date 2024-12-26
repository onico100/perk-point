import my_http from "@/services/http";
import {
  getApiClubs,
  getBenefitsClubsWithSupplierId,
} from "@/utils/clubsUtils";
import { getAllClubs } from "./clubsService";
import { Benefit } from "@/types/BenefitsTypes";
import { Club } from "@/types/ClubTypes";
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

  for (const club of clubsWithApi) {
    const clubBenefits = await fetchBenefits(
      club._id || " ",
      club.clubRoute || ""
    );
    const mappedBenefits = await getBenefitsClubsWithSupplierId(clubBenefits);
    mappedBenefits.forEach((benefit) => {
      benefit.clubId = club._id || " ";
      allApiBenefits.push(benefit);
    });
  }
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

export async function increaseBenefit(
  id: string,
): Promise<Benefit> {
  try {
    const response = await my_http.patch(`/benefits/increaseCounter/${id}`,);
    return response.data;
  } catch (error) {
    console.error(`Error increase benefit counter with ID ${id}:`, error);
    throw error;
  }
}
