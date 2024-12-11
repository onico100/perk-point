"use client";
import LoginSupplierComponent from "@/components/SignPages/loginSupplier";
import styles from "@/styles/SignPages/sign.module.css";
export default function LoginSupplierPage() {

  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <LoginSupplierComponent />
      </div>
    </div>
  );
}
