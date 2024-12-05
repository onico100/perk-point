"use client";
import React from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";
import { useRouter } from "next/navigation";

const TopBarButtons: React.FC = () => {
  const router = useRouter();
  const {
    clientMode,
    currentSupplier,
    currentUser,
    setClientMode,
    setCurrentUser,
    setCurrentSupplier,
  } = useGeneralStore();

  const handleDisconnect = () => {
    setClientMode(ClientMode.general);
    setCurrentSupplier(null);
    setCurrentUser(null);
  };

  const handleConnectionMode = (path: string) => {
    setClientMode(ClientMode.connection);
  
    localStorage.setItem("general-store", JSON.stringify({
      ...JSON.parse(localStorage.getItem("general-store") || "{}"),
      state: {
        ...JSON.parse(localStorage.getItem("general-store") || "{}").state,
        clientMode: ClientMode.connection,
      },
    }));

    router.push(path);
  };

  return (
    <>
      {clientMode === "GENERAL" && (
        <div className={styles.buttonsContainer}>
          <button
            className={styles.loginButton}
            onClick={() => handleConnectionMode("/login")}
          >
            התחברות
          </button>
          <button
            className={styles.signupButton}
            onClick={() => handleConnectionMode("/signup")}
          >
            הרשמה
          </button>
        </div>
      )}

      {clientMode === "USER" && (
        <div className={styles.buttonsContainer}>
          <h1>{`שלום ${currentUser?.username}`}</h1>
          <button className={styles.signupButton} onClick={handleDisconnect}>
            התנתקות
          </button>
        </div>
      )}

      {clientMode === "SUPPLIER" && (
        <div className={styles.buttonsContainer}>
          <h1>{`שלום ${currentSupplier?.providerName}`}</h1>
          <button className={styles.signupButton} onClick={handleDisconnect}>
            התנתקות
          </button>
        </div>
      )}
    </>
  );
};

export default TopBarButtons;
