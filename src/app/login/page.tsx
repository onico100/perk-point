"use client";
import { Login } from "@/components";
import TabSign from "@/components/TabSign";
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