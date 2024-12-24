import my_http from "./http";
import { Admin } from "@/types/Generaltypes";

export async function getSupplierByCredentials(
  email: string,
  password: string
): Promise<Admin> {
  const response = await my_http.post("/admin/get/login", { email, password });
  return response.data;
}
