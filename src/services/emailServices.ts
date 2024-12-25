import { User } from "@/types/Generaltypes";
import my_http from "./http";

export const checkEmailService = async (email: string): Promise<boolean> => {
  try {
    let emailToSend=email.toLowerCase()
    const response = await my_http.post("/checkEmail", { emailToSend });
    return response.data.exists;
  } catch (error) {
    console.error("Error checking email:", error);
    return true;
  }
};

export const returnUserCheckEmailService = async (
  email: string
): Promise<User | null> => {
  try {
    let emailToSend=email.toLowerCase()
    const response = await my_http.post("/checkEmail", { emailToSend });
    if (response.status !== 200) {
      console.error("Unexpected response status:", response.status);
      return null;
    }

    if (response.data.exists && response.data.user) {
      return response.data.user as User;
    }

    return null;
  } catch (error: any) {
    console.error(
      "Error checking email:",
      error?.response?.data || error.message
    );
    return null;
  }
};

export const sendPasswordResetEmail = async (
  email: string
): Promise<boolean> => {
  try {
    const response = await my_http.post("/passwordReset", { email });
    return response.data.success;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};
