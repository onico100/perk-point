"use client";
import { useState } from "react";
import useGeneralStore from "@/stores/generalStore";
import { useLoginUser } from "@/hooks/useFetchUsers";
import styles from "@/styles/SignPages/sign.module.css";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { errorAlert, helloAlert } from "@/utils/sweet-alerts";
import { sendPasswordResetEmail } from "@/services/emailServices";
//import LoginGoogleButton from "./authLogin";

export default function SupplierLoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const loginUserMutation = useLoginUser();
  const { loginSupplier } = useFetchSuppliers();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (forgotPassword) {
      handleForgotPassword();
      return;
    } else {
      loginSupplier(
        { email, password },
        {
          onSuccess: (supplier) => {
            router.push(`benefits/${supplier._id}`);
          },
          onError: (error) => {
            console.error(error);
          },
        }
      );
    }
  };

  const handleForgotPassword = async () => {
    const success = await sendPasswordResetEmail(email);
    if (success) {
      setMessage("קישור לאיפוס סיסמה נשלח לאימייל שלך.");
    } else {
      setMessage("שגיאה בשליחת האימייל. נסה שוב מאוחר יותר.");
    }
  };

  return (
    <div className={styles.loginPage}>
      <h1>התחברות ספק</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="email">כתובת אימייל:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {!forgotPassword && (
          <div className={styles.formGroup}>
            <label htmlFor="password">סיסמא:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <p
              className="text-red-500 underline cursor-pointer text-xs"
              onClick={() => setForgotPassword(!forgotPassword)}
            >
              שכחתי סיסמה
            </p>
          </div>
        )}

        <div className={styles.inlineContainer}>
          <p>אינך ספק רשום? </p>
          <Link className={styles.link} href={"/register-supplier"}>
            הירשם
          </Link>
        </div>

        {!forgotPassword && (
          <button type="submit" className={styles.loginPageButton}>
            התחברות
          </button>
        )}
        {forgotPassword && (
          <button type="submit">שלח קישור לאיפוס סיסמה</button>
        )}
        {message && <p>{message}</p>}
      </form>
      {/* <LoginGoogleButton /> */}
    </div>
  );
}
