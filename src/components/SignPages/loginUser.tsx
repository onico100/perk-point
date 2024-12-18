"use client";
import { useState } from "react";
import { useLoginUser } from "@/hooks/useFetchUsers";
import styles from "@/styles/SignPages/login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  beforeActionAlert,
  errorAlert,
  helloAlert,
} from "@/utils/sweet-alerts";
import { sendPasswordResetEmail } from "@/services/emailServices";
import LoginGoogleForm from "./loginGoogleForm";
import styles2 from "@/styles/SignPages/google.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const loginUserMutation = useLoginUser();
  const router = useRouter();

  const loginAsExampleUser = async () => {
    const ift = await beforeActionAlert(
      "בכניסה למצב לקוח לדוגמא אתה נכנס למצב בו כולם יכולים לערוך ולכן יתכן שהשינויים שעשית לא יישמרו למשך זמן"
    );
    if (!ift) return;
    const emailA = "userexample@try.com";
    const passwordA = "useruser";
    loginUserMutation.mutate(
      { email: emailA, password: passwordA },
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
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (forgotPassword) {
      handleForgotPassword();
      return;
    } else {
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
      <h1 className={styles.titleSign}>התחברות לקוח</h1>
      <div className={styles.signOption}>
        <div className="sign">
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formGroup}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="כתובת אימייל"
                required
                className={styles.inputField}
              />
            </div>

            {!forgotPassword && (
              <div className={styles.formGroup}>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="סיסמא"
                  required
                  className={styles.inputField}
                />
                <p
                  className="text-red-500 underline cursor-pointer text-xs"
                  onClick={() => setForgotPassword(!forgotPassword)}
                >
                  שכחתי סיסמה
                </p>
              </div>
            )}
            {!forgotPassword && (
              <button type="submit" className={styles.loginPageButton}>
                התחברות
              </button>
            )}
            {message && <p className="text-red-500">{message}</p>}
            {forgotPassword && (
              <button type="submit">שלח קישור לאיפוס סיסמה</button>
            )}

            <br />
          </form>
        </div>
        <div className="google">
          <h2>או</h2>
          <LoginGoogleForm />
        </div>
        <button className={styles2.googleButton} onClick={loginAsExampleUser}>
          התחברות כלקוח לדוגמא
        </button>
      </div>

      <div className={styles.noAccountLink}>
        <Link href={"/register-user"}>פעם ראשונה באתר? הרשמה</Link>
      </div>
    </div>
  );
}
