import my_http from "@/services/http";
import { Club } from "@/types/types";

export async function getAllClubs() {
  try {
    const response = await my_http.get("/clubs/get");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getClubById(id: string) {
  try {
    const response = await my_http.get(`/clubs/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching club with ID ${id}:`, error);
  }
}

export async function updateClubById(
  id: string,
  updatedData: any
): Promise<Club> {
  try {
    const response = await my_http.patch(`/clubs/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating club with ID ${id}:`, error);
    throw error;
  }
}export async function updateStatusClubById(
  id: string,
  updatedData: any
): Promise<Club> {
  try {
    const response = await my_http.patch(`/clubs/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating club with ID ${id}:`, error);
    throw error;
  }
}

export async function addClub(newClub: Club): Promise<Club> {
  try {
    const response = await my_http.post("/clubs/insert", newClub);
    return response.data;
  } catch (error) {
    console.error("Error creating new club:", error);
    throw error;
  }
}