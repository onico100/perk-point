import my_http from "@/services/http";

export async function getAllCategories() {
    try {
        const response = await my_http.get("/categories/get");
        return response.data;
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