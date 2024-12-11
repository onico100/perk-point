"use client"
import { FcGoogle } from "react-icons/fc"; 
import { doSocialLogin } from "./actions";
import styles from "./google.module.css";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, User } from "@/types/types";


const LoginGoogleForm = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const setCurrentUser = useGeneralStore((state) => state.setCurrentUser);

  useEffect(() => {
    if (session?.user) {
      console.log("Session user:", session.user);

      const userS: User = {
        _id: session.user.id || "", 
        username: session.user.name || "",
        email: session.user.email || "",
        clubs: [], 
        registrationDate: new Date().toISOString(), 
        savedBenefits: [], 
        city: "",
        isActive: true, 
        password: "", 
      };

      setCurrentUser(userS);
      const setClientMode = useGeneralStore.getState().setClientMode;
      setClientMode(ClientMode.user);
      console.log("Current user:", userS);
    }
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
