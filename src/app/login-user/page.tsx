"use client";
import LoginUserComponent from "@/components/SignPages/loginUser";
import useGeneralStore from "@/stores/generalStore";
import styles from "@/styles/SignPages/sign.module.css";
import { ClientMode, PreMode } from "@/types/types";
export default function LoginUserPage() {

  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <LoginUserComponent />
      </div>
    </div>
  );
}
