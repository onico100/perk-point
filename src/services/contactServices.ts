import my_http from "@/services/http";
import { ContactForm } from "@/types/types";

export async function getAllContactForms(): Promise<ContactForm[]> {
  try {
    const response = await my_http.post("/contact/get");
    const allForms: ContactForm[] = response.data.data;
    console.log("allForms: ", allForms);
    return allForms
  } catch (error) {
    console.error("Error fetching contact forms:", error);
    throw error;
  }
}


export async function getContactFormById(id: string): Promise<ContactForm> {
  try {
    const response = await my_http.get(`/contact/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contact form with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteContactFormById(
  id: string
): Promise<{ message: string }> {
  try {
    const response = await my_http.patch(`/contact/delete/${id}`, {
      isActive: false,
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting contact form with ID ${id}:`, error);
    throw error;
  }
}

export async function updateContactFormStatus(
    id: string,
    status: string
  ): Promise<{ message: string }> {
    try {
      const response = await my_http.patch(`/contact/update/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating contact form status with ID ${id}:`, error);
      throw error;
    }
  }