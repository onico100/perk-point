import my_http from "@/services/http";
import { Benefit_api } from "@/types/BenefitsTypes";


export async function getAllBenefitsAPI(): Promise<Benefit_api[]> {
    try {
        const response = await my_http.post("/benefitsApi/get");
        const allBenefitsCounter: Benefit_api[] = response.data.data;
        return allBenefitsCounter;
    } catch (error) {
        console.error("Error fetching benefits:", error);
        throw error;
    }
}

export async function getBenefitsAPIById(id: string): Promise<Benefit_api> {
    try {
        const response = await my_http.get(`/benefitsApi/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching benefit with ID ${id}:`, error);
        throw error;
    }
}

export async function deleteBenefitAPIById(
    id: string
): Promise<{ message: string }> {
    try {
        const response = await my_http.delete(`/benefitsApi/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting benefit with ID ${id}:`, error);
        throw error;
    }
}
export async function updateBenefitAPIById(
    id: string,
    updatedData: any
): Promise<Benefit_api> {
    try {
        const response = await my_http.patch(`/benefitsApi/update/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating benefit with ID ${id}:`, error);
        throw error;
    }
}

export async function addBenefitAPI(newBenefit: Benefit_api): Promise<Benefit_api> {
    try {
        const response = await my_http.post("/benefitsApi/insert", newBenefit);
        return response.data;
    } catch (error) {
        console.error("Error creating new benefit:", error);
        throw error;
    }
}
