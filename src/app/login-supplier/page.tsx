"use client";
import LoginSupplierComponent from "@/components/SignPages/loginSupplier";
import useGeneralStore from "@/stores/generalStore";
import styles from "@/styles/SignPages/sign.module.css";
import { ClientMode, PreMode } from "@/types/types";
export default function LoginSupplierPage() {

  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <LoginSupplierComponent />
      </div>
    </div>
  );
}
