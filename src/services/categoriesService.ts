import my_http from "@/services/http";
import { Category } from "@/types/types";

export async function getAllCategories() {
    try {
        const response = await my_http.get("/categories/get");
        const sortedData = response.data.sort((a: Category, b: Category) => {
            return a.categoryName.localeCompare(b.categoryName, 'he');
        });
        return sortedData;
    }
    catch (error) {
        console.error(error);
    }
}

export async function getCategoryById(id: string) {
    try {
        const response = await my_http.get(`/categories/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
    }
}