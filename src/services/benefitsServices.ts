import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import my_http from "@/services/http";
import useGeneralStore from "@/stores/generalStore";
import useSupplierStore from "@/stores/suppliersStore";
import { Benefit, Club, Supplier } from "@/types/types";
import {
  getApiClubs,
  getBenefitsClubsWithSupplierId,
} from "@/utils/clubsUtils";
import { getAllClubs } from "./clubsService";
import { getAllSuppliers } from "./suppliersServices";

export async function getAllBenefitsFormAll(): Promise<Benefit[]> {
  const dataBaseBenefits = await getAllBenefits();
  console.log(222, dataBaseBenefits);
  const clubs = await getAllClubs();
  let clubsWithApi: Club[] = [];
  if (clubs && clubs.length > 0) {
    console.log(333, "clubssssssssssssss");
    clubsWithApi = getApiClubs(clubs);
  } else {
    console.log("Error fetching clubs");
    return dataBaseBenefits;
  }
  console.log(222, "clubs", clubsWithApi);

  // Fetch benefits for each club with API data and map them to the desired format
  const allApiBenefits: Benefit[] = [];

  for (const club of clubsWithApi) {
    const clubBenefits = await fetchBenefits(club._id, club.clubRoute || ""); // Fetch benefits for the club
    const mappedBenefits = await getBenefitsClubsWithSupplierId(clubBenefits); // Map the fetched benefits to the desired format

    // Assign the current club ID to all benefits and collect them
    mappedBenefits.forEach((benefit) => {
      benefit.clubId = club._id;
      allApiBenefits.push(benefit);
    });
  }

  console.log(2222, "result", [...dataBaseBenefits, ...allApiBenefits]);
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
