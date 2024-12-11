
import { User } from "@/types/types";
import my_http from "./http";
import { Console } from "console";

export const checkEmailService = async (email: string): Promise<boolean> => {
  console.log("checkEmailService Checking email:", email);
  try {
    const response =   await my_http.post("/checkEmail", { email });
    return response.data.exists;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

export const returnUserCheckEmailService = async (email: string): Promise<User | null> => {
  console.log("Checking email for user:", email);
  try {
    const response = await my_http.post("/checkEmail", { email });
    console.log("Response:", response);

    if (response.status !== 200) {
      console.error("Unexpected response status:", response.status);
      return null;
    }

    if (response.data.exists && response.data.user) {
      return response.data.user as User; 
    }

    return null; 
  } catch (error: any) {
    console.error("Error checking email:", error?.response?.data || error.message);
    return null; 
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
  console.log("sendPasswordResetEmail Checking email:", email);
  try {
    const response = await my_http.post("/passwordReset", { email });
    return response.data.success;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};