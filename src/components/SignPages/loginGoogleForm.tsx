"use client"
import { FcGoogle } from "react-icons/fc"; 
import { doSocialLogin } from "./actions";
import styles from "./google.module.css";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, User } from "@/types/types";
import { useRouter } from "next/navigation";
import { returnUserCheckEmailService } from "@/services/emailServices";


const LoginGoogleForm = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const setCurrentUser = useGeneralStore((state) => state.setCurrentUser);
  const setClientMode = useGeneralStore.getState().setClientMode;

  const router = useRouter();

  const fetchUser = async () => {
    if (session?.user) {
      console.log("Session user:", session.user);
      const exitedUser = await returnUserCheckEmailService(session.user.email || "---")|| null;
      console.log("Existed user:", exitedUser);
      if (exitedUser) {
          const userS = {
          _id: exitedUser?._id || "", 
          username: exitedUser?.username|| "",
          email: exitedUser?.email || "",
          clubs: [], 
          registrationDate: exitedUser?.registrationDate || new Date().toISOString(), 
          savedBenefits: [], 
          city: exitedUser?.city || "",
          isActive: true, 
          password: exitedUser?.password || "", 
        };
        setCurrentUser(userS);
        setClientMode(ClientMode.user);
        router.push("/"); 
      } else {
        console.error("User not found or error occurred.");
      }
    }
  }

  useEffect(() => {
    fetchUser();
  }, [session]);



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const action = formData.get("action");
    if (action) {
      setLoading(true); 
      await doSocialLogin(formData);
      setLoading(false); 
    } else {
      console.error("Action is null");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="action" value="google" />
      <button type="submit" className={styles.googleButton} disabled={loading}>
        {loading ? "מתבצעת התחברות..." : "המשך באמצעות Google"}
        <FcGoogle className="text-2xl mr-2" />
      </button>
    </form>
  );
};

export default LoginGoogleForm;
