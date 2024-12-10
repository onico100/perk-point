//perk-point/src/components/SignPages/loginUser.tsx
"use client";
import { useState } from "react";
import useGeneralStore from "@/stores/generalStore";
import { useLoginUser } from "@/hooks/useFetchUsers";
import styles from "@/styles/SignPages/sign.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { errorAlert, helloAlert } from "@/utils/sweet-alerts";
import { sendPasswordResetEmail } from "@/services/emailServices";
import { signIn } from "@/auth";
//import { signIn } from "next-auth/react";
//import LoginGoogleButton from "./authLogin";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const preMode = useGeneralStore((state) => state.preMode);
  const loginUserMutation = useLoginUser();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (forgotPassword) {
      handleForgotPassword();
      return;
    }
    if (preMode === "USER") {
      loginUserMutation.mutate(
        { email, password },
        {
          onSuccess: (user) => {
            helloAlert(`שלום ${user.username} ☺️`);
            router.push(`benefits/${user._id}`);
          },
          onError: (error) => {
            console.error(error);
            errorAlert("התחברות נכשלה: פרטי לקוח אינם תקינים.");
          },
        }
      );
    } else {
      errorAlert("לא נבחר מצב התחברות (משתמש או ספק)");
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
      {message && <p className="text-red-500">{message}</p>}
      <h1 className={styles.titleSign}>התחברות לקוח</h1>
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

          <p className="text-red-500 underline cursor-pointer text-xs"
            onClick={() => setForgotPassword(!forgotPassword)}>
            שכחתי סיסמה
          </p>

        </div>
        )}

        <div className={styles.inlineContainer}>
          <p>איך לך עדיין משתמש?</p>
          <Link className={styles.link} href={"/register-user"}>
            הירשם
          </Link>
        </div>

        {!forgotPassword && <button type="submit" className={`${styles.formGroup} loginPage button`}>התחברות</button>}
        {forgotPassword && (<button type="submit">שלח קישור לאיפוס סיסמה</button>)}
        {message && <p>{message}</p>}

      </form>
      

    </div>
  );
}
