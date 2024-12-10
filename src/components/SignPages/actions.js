'use server'
import { signIn } from "@/auth";
import { findOrCreateUser } from "@/services/mongo";

export async function doSocialLogin(formData) {
  const action = formData.get('action');
  const syUser = await signIn(action); 

  console.log("--------------User:", syUser);

  if (!syUser || !syUser.email) {
    throw new Error("התחברות נכשלה.");
  }

  // const user = await findOrCreateUser(profile);
  // console.log("--------------User after findOrCreateUser:", user);
  // const session = await encrypt({ userId: user._id, email: user.email });
  // cookies().set("session", session, {
  //   httpOnly: true,
  //   secure: true,
  //   path: "/",
  // });



  return syUser;
}


export async function doLogout() {
  await signOut({ redirectTo: "/" });
}