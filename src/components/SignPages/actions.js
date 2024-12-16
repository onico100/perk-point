'use server'
import { signIn } from "@/auth";

export async function doSocialLogin(formData) {
  const action = formData.get('action');
  const syUser = await signIn(action); 
  if (!syUser || !syUser.email) { throw new Error("התחברות נכשלה.");  }
  return syUser;
}


export async function doLogout() {
  await signOut({ redirectTo: "/" });
}