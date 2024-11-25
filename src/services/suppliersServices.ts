import my_http from "./http";

import { Supplier } from "@/types/types";

export const SuppliersService = {
  async getAllSuppliers(): Promise<Supplier[]> {
    const response = await my_http.get("/suppliers/get");
    return response.data;
  },

  async getSupplierById(id: string): Promise<Supplier> {
    const response = await my_http.get(`/suppliers/get/${id}`);
    return response.data;
  },

  async getSupplierByCredentials(
    name: string,
    password: string
  ): Promise<Supplier> {
    const response = await my_http.post("/suppliers/get/login", {
      name,
      password,
    });
    return response.data;
  },

  async addSupplier(supplier: Supplier): Promise<Supplier> {
    const response = await my_http.post("/suppliers/insert", supplier);
    return response.data;
  },

  async updateSupplierById(
    id: string,
    updatedData: Partial<Supplier>
  ): Promise<Supplier> {
    const response = await my_http.patch(
      `/suppliers/update/${id}`,
      updatedData
    );
    return response.data;
  },

  async deleteSupplierById(id: string): Promise<{ message: string }> {
    const response = await my_http.delete(`/suppliers/delete/${id}`);
    return response.data;
  },
};
