import my_http from "./http";

export const checkEmailService = async (email: string): Promise<boolean> => {
  try {
    const response = await  await my_http.post("/api/checkEmail", { email });
    return response.data.exists;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};
