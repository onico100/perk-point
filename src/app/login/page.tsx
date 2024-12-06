"use client";
import { Login, TabSign } from "@/components/index";
import useGeneralStore from "@/stores/generalStore";
import styles from "@/styles/SignPages/sign.module.css";
import { ClientMode } from "@/types/types";
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
