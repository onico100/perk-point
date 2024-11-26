import my_http from "@/services/http";
import { Benefit } from "@/types/types";

export async function getAllBenefits(): Promise<Benefit[]> {
    try {
        const response = await my_http.get("/benefits");
        const allBenefits: Benefit[] = response.data;
        const currentDate = new Date();
        const activeBenefits = allBenefits.filter(benefit => {
            return new Date(benefit.expirationDate) >= currentDate && benefit.isActive;
        });
        return activeBenefits;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getBenefitsById(id: string): Promise<Benefit> { 
    try {
        const response = await my_http.get(`/benefits/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching benefit with ID ${id}:`, error);
        throw error;
    }
}

export async function deleteBenefitById(id: string): Promise<{ message: string }> {
    try {
        const response = await my_http.delete(`/benefits/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting benefit with ID ${id}:`, error);
        throw error;
    }
}
export async function updateBenefitById(id: string, updatedData: Benefit): Promise<Benefit> {
    try {
        const response = await my_http.put(`/benefits/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating benefit with ID ${id}:`, error);
        throw error;
    }
}

export async function addBenefit(newBenefit: Benefit): Promise<Benefit> {
    try {
        const response = await my_http.post("/benefits", newBenefit);
        return response.data;
    } catch (error) {
        console.error("Error creating new benefit:", error);
        throw error;
    }
}





