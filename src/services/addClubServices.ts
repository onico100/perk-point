import my_http from "@/services/http";
import { addClubForm } from "@/types/types";

export async function getAllAddClubForms(): Promise<addClubForm[]> {
    try {
        const response = await my_http.post("/addClub/get");
        const allForms: addClubForm[] = response.data.data;
        console.log("allForms: ", allForms);
        return allForms
    } catch (error) {
        console.error("Error fetching add club forms:", error);
        throw error;
    }
}


export async function getAddClubFormById(id: string): Promise<addClubForm> {
    try {
        const response = await my_http.get(`/addClub/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching add club form with ID ${id}:`, error);
        throw error;
    }
}

export async function deleteAddClubFormById(
    id: string
): Promise<{ message: string }> {
    try {
        const response = await my_http.patch(`/addClub/delete/${id}`, {
            isActive: false,
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting add club form with ID ${id}:`, error);
        throw error;
    }
}

export async function updateAddClubFormStatus(
    id: string,
    status: string
): Promise<{ message: string }> {
    try {
        const response = await my_http.patch(`/addClub/update/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating add club form status with ID ${id}:`, error);
        throw error;
    }
}