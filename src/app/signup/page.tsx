"use client";
import { TabSign } from "@/components/index";
import SignUserComponent from "@/components/SignPages/signUser";
import SignSupplierComponent from "@/components/SignPages/signSupplier";
import useGeneralStore from "@/stores/generalStore";
import styles from "@/styles/SignPages/sign.module.css";
import { ClientMode } from "@/types/types";

export default function SignUp() {


  const { preMode } = useGeneralStore();

  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <TabSign tabContent="הרשמה" />
        {preMode === "USER" && <SignUserComponent />}
        {preMode === "SUPPLIER" && <SignSupplierComponent />}
      </div>
    </div>
  );
}
