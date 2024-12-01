"use client";
import { Login, TabSign } from "@/components/index";
import styles from "@/styles/login.module.css";
export default function LoginPage() {
  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <TabSign tabContent="התחברות " />
        <Login />
      </div>
    </div>
  );
}