'use server'
import { signIn } from "@/auth";
import { findOrCreateUser } from "@/services/mongo";

export async function doSocialLogin(formData) {
  const action = formData.get('action');
  const syUser = await signIn(action); 
  console.log("1--------------User:", syUser);
  if (!syUser || !syUser.email) { throw new Error("התחברות נכשלה.");  }
  console.log("2--------------User:", syUser);
  return syUser;
}


export async function doLogout() {
  await signOut({ redirectTo: "/" });
}