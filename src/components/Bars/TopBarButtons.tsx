"use client";
import React from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";
import { useRouter } from "next/navigation";
import userProfile from "@/assets/user-profile.svg";

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
    //setClientMode(ClientMode.connection);
    router.push(path);
  };

  return (
    <>
      {clientMode === "GENERAL" && (
        <div className={styles.buttonsContainer}>
          <button
            className={styles.loginButton}
            onClick={() => handleConnectionMode("/login-user")}
          >
            <img src={userProfile.src} alt="icon" className={styles.icon} />
          </button>
          <button
            className={styles.signupButton}
            onClick={() => handleConnectionMode("/login-supplier")}
          >
            כניסת ספקים
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
