"use client";
import { useState } from "react";
import styles from "@/styles/SignPages/login.module.css";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "@/services/emailServices";
import { beforeActionAlert } from "@/utils/sweet-alerts";
import styles2 from "@/styles/SignPages/google.module.css";

export default function SupplierLoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { loginSupplier } = useFetchSuppliers();

  const router = useRouter();

  const loginAsExampleSupl = async () => {
    const ift = await beforeActionAlert(
      "בכניסה למצב ספק לדוגמא אתה נכנס למצב בו כולם יכולים לערוך ולכן יתכן שהשינויים שעשית לא יישמרו למשך זמן"
    );
    if (!ift) return;
    const emailA = "supplier@example.com";
    const passwordA = "suppliersupplier";
    loginSupplier(
      { email: emailA, password: passwordA },
      {
        onSuccess: (supplier) => {
          router.push("/");
        },
        onError: (error) => {
          console.error(error);
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
      <h1 className={styles.titleSign}>התחברות ספק</h1>
      <div className={styles.signOption}>
        <div className="sign">
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formGroup}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
          או
          <button className={styles2.googleButton} onClick={loginAsExampleSupl}>
            התחברות כספק לדוגמא
          </button>
        </div>
      </div>

      <div className={styles.noAccountLink}>
        <Link href={"/register-supplier"}>פעם ראשונה באתר? הרשמה</Link>
      </div>
    </div>
  );
}
