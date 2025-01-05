"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/general/resetPassword.module.css";
import { passwordSchema } from "@/types/SupplierTypes";

export default function PasswordReset() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email");
    const roleFromUrl = urlParams.get("role");

    if (!emailFromUrl || !roleFromUrl) {
      setMessage("קישור לא חוקי");
      return;
    }

    setEmail(emailFromUrl);
    setRole(roleFromUrl);
  }, []);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("הסיסמאות אינן תואמות");
      return;
    }

    const passwordValidation = passwordSchema.safeParse(newPassword);
    if (!passwordValidation.success) {
      setMessage(passwordValidation.error.errors[0].message);
      return;
    }

    if (!email || !role) {
      setMessage("קישור לא חוקי");
      return;
    }

    try {
      const response = await fetch("/api/passwordUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, newPassword }),
      });

      if (response.ok) {
        setMessage("איפוס הסיסמה בוצע בהצלחה. מעביר לעמוד הבית...");
        setTimeout(() => router.push("/"), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || "שגיאה באיפוס הסיסמה");
      }
    } catch (error) {
      ///dfxdrxrx
      console.error("Error resetting password:", error);
      setMessage("שגיאה באיפוס הסיסמה. נסה שוב מאוחר יותר.");
    }
  };

  return (
    <div className={styles.resetPasswordContainer}>
      <h1 className={styles.resetPasswordTitle}>איפוס סיסמה</h1>
      {message && <p className={styles.resetPasswordMessage}>{message}</p>}
      <input
        type="password"
        placeholder="סיסמה חדשה"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={styles.resetPasswordInput}
      />
      <input
        type="password"
        placeholder="אימות סיסמה"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={styles.resetPasswordInput}
      />
      <button
        onClick={handleResetPassword}
        className={styles.resetPasswordButton}
      >
        איפוס סיסמה
      </button>
    </div>
  );
}
