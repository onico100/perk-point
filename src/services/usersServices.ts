import my_http from "./http";
import { User } from "@/types/Generaltypes";

export async function getUserById(id: string): Promise<User> {
  const response = await my_http.get(`/users/get/${id}`);
  return response.data;
}
export async function getAllUsers(): Promise<User> {
  const response = await my_http.get("/users/get");
  return response.data;
}

export async function getUserByCredentials(
  email: string,
  password: string
): Promise<User> {
  const response = await my_http.post("/users/get/login", {
    email,
    password,
  });
  return response.data;
}

export async function addUser(user: User): Promise<User> {
  const response = await my_http.post("/users/insert", user);
  return response.data;
}

export async function updateUserById(
  id: string,
  updatedData: Partial<User>
): Promise<User> {
  const response = await my_http.patch(`/users/update/${id}`, updatedData);
  return response.data;
}

export async function deleteUserById(id: string): Promise<{ message: string }> {
  const response = await my_http.delete(`/users/delete/${id}`);
  return response.data;
}
