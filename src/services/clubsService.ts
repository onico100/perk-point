import my_http from "@/services/http";

export async function getAllClubs() {
    try {
        const response = await my_http.get("/clubs/get");
        return response.data;
    }
    catch (error) {
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