"use client";
import SignSupplierComponent from "@/components/SignPages/signSupplier";
import styles from "@/styles/SignPages/sign.module.css";

export default function registerSupplier() {



  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <SignSupplierComponent />
      </div>
    </div>
  );
}
