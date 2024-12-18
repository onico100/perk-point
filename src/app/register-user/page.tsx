"use client";
import SignUserComponent from "@/components/SignPages/signUser";
import styles from "@/styles/SignPages/sign.module.css";

export default function registerUser() {
  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <SignUserComponent />
      </div>
    </div>
  );
}
