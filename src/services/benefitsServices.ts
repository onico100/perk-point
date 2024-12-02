import my_http from "@/services/http";
import { Benefit } from "@/types/types";

export async function getAllBenefits(): Promise<Benefit[]> {
    try {
        const response = await my_http.get("/benefits/get");
        const allBenefits: Benefit[] = response.data;

        // Filter only active benefits
        const activeBenefits = allBenefits.filter(benefit => benefit.isActive);

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

export async function deleteBenefitById(id: string): Promise<{ message: string }> {
    try {
        const response = await my_http.delete(`/benefits/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting benefit with ID ${id}:`, error);
        throw error;
    }
}
export async function updateBenefitById(id: string, updatedData: any): Promise<Benefit> {
    try {
        const response = await my_http.patch(`/benefits/update/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating benefit with ID ${id}:`, error);
        throw error;
    }
}

export async function addBenefit(newBenefit: Omit<Benefit, "_id">): Promise<Benefit> {
    try {
        const response = await my_http.post("/benefits/insert", newBenefit);
        return response.data;
    } catch (error) {
        console.error("Error creating new benefit:", error);
        throw error;
    }
}







