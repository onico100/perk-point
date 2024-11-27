import my_http from "./http";

import { Supplier } from "@/types/types";

export async function getAllSuppliers(): Promise<Supplier[]> {
  const response = await my_http.get("/suppliers/get");
  return response.data;
}

export async function getSupplierById(id: string): Promise<Supplier> {
  const response = await my_http.get(`/suppliers/get/${id}`);
  return response.data;
}

export async function getSupplierByCredentials(
  email: string,
  password: string
): Promise<Supplier> {
  const response = await my_http.post("/suppliers/get/login", {
    email,
    password,
  });
  return response.data;
}

export async function addSupplier(supplier: Supplier): Promise<Supplier> {
  const response = await my_http.post("/suppliers/insert", supplier);
  return response.data;
}

export async function updateSupplierById(
  id: string,
  updatedData: Partial<Supplier>
): Promise<Supplier> {
  const response = await my_http.patch(`/suppliers/update/${id}`, updatedData);
  return response.data;
}

export async function deleteSupplierById(
  id: string
): Promise<{ message: string }> {
  const response = await my_http.delete(`/suppliers/delete/${id}`);
  return response.data;
}
