"use client";
import LoginGoogleForm from "@/components/SignPages/loginGoogleForm";
import LoginUserComponent from "@/components/SignPages/loginUser";
import styles from "@/styles/SignPages/sign.module.css";
export default function LoginUserPage() {


  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <LoginUserComponent />
      </div>
    </div>
  );
}
