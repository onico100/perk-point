"use client";
import { TabSign } from "@/components/index";
import SignUserComponent from "@/components/signUser";
import SignSupplierComponent from "@/components/SighPages//signSupplier";
import useGeneralStore from "@/stores/generalStore";
import styles from "@/styles/SignPages/sign.module.css";
import { ClientMode } from "@/types/types";

export default function SignUp() {
  // const setClientMode = useGeneralStore.getState().setClientMode;
  // setClientMode(ClientMode.connection);

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
