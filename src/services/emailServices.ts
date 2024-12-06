import my_http from "./http";

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