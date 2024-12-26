import my_http from "@/services/http";

import { BenefitApi } from "@/types/BenefitsTypes";

export async function getAllBenefitsApi(): Promise<BenefitApi[]> {
    try {
        const response = await my_http.post("/benefitApi/get");
        const allBenefits: BenefitApi[] = response.data;
        const activeBenefits = allBenefits.filter((benefit) => benefit.isActive);
        return activeBenefits;
    } catch (error) {
        console.error("Error fetching benefits:", error);
        throw error;
    }
}

export async function getBenefitApiById(id: string): Promise<BenefitApi> {
    try {
        const response = await my_http.get(`/benefitApi/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching benefit with ID ${id}:`, error);
        throw error;
    }
}

export async function updateBenefitApiById(
    id: string,
    updatedData: any
): Promise<BenefitApi> {
    try {
        const response = await my_http.patch(`/benefitApi/update/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating benefit with ID ${id}:`, error);
        throw error;
    }
}

export async function addBenefitApi(newBenefit: BenefitApi): Promise<BenefitApi> {
    try {
        const response = await my_http.post("/benefitApi/insert", newBenefit);
        return response.data;
    } catch (error) {
        console.error("Error creating new benefit:", error);
        throw error;
    }
}
