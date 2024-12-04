import React, { useState } from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";
import Link from "next/link";

const TopBarButtons: React.FC = () => {
  const { clientMode, currentSupplier, currentUser } = useGeneralStore();

  const [popupVisible, setPopupVisible] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const setClientMode = useGeneralStore.getState().setClientMode;
  const setCurrentUser = useGeneralStore.getState().setCurrentUser;
  const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;

  const handleDisconnect = () => {
    setClientMode(ClientMode.general);
    setCurrentSupplier(null);
    setCurrentUser(null);
    setPopupVisible(false);
    setAnchorElement(null);
  };


  return (
    <>
      {clientMode === "GENERAL" && (
        <div className={styles.buttonsContainer}>
          <Link className={styles.loginButton} href={"/login"}>
            התחברות
          </Link>
          <Link className={styles.signupButton} href={"/signup"}>
            הרשמה
          </Link>
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
