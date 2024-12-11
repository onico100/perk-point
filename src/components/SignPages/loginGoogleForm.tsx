"use client"
import { FcGoogle } from "react-icons/fc"; 
import { doSocialLogin } from "./actions";
import styles from "./google.module.css";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, User, UserFormValues } from "@/types/types";


const LoginGoogleForm = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const setCurrentUser = useGeneralStore((state) => state.setCurrentUser);

  useEffect(() => {
    if (session?.user) {
      console.log("Session user:", session.user);

      const userS: User = {
        _id: session.user.id || "", // או ערך ברירת מחדל
        username: session.user.name || "",
        email: session.user.email || "",
        clubs: [], // ברירת מחדל לרשימה ריקה
        registrationDate: "", // תאריך ריק
        savedBenefits: [], // ברירת מחדל לרשימה ריקה
        city: "",
        isActive: true, // ברירת מחדל לערך בוליאני
        password: "", // או null אם לא בשימוש
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
