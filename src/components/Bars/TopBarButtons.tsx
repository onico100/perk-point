import React, { useState } from "react";
import styles from "@/styles/Bars/TopBar.module.css";
// import { ModePopup } from "../index";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";
import Link from "next/link";

const TopBarButtons: React.FC = () => {
  const { clientMode, currentSupplier, currentUser } = useGeneralStore();

  // const [popupVisible, setPopupVisible] = useState(false);
  // const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  // const [actionType, setActionType] = useState<"login" | "register">("login");

  const handleDisconnect = () => {
    const setClientMode = useGeneralStore.getState().setClientMode;
    setClientMode(ClientMode.general);
    const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;
    setCurrentSupplier(null);
    const setCurrentUser = useGeneralStore.getState().setCurrentUser;
    setCurrentUser(null);
  };

  return (
    <>
      {clientMode === "GENERAL" && (
        <div className={styles.buttonsContainer}>
          <Link className={styles.loginButton} href={"/login"}>
            התחברות
          </Link>
          <Link className={styles.registerButton} href={"/signup"}>
            הרשמה
          </Link>
        </div>
      )}

      {clientMode === "USER" && (
        <div className={styles.buttonsContainer}>
          <h1>{`שלום ${currentUser?.username}`}</h1>
          <button className={styles.registerButton} onClick={handleDisconnect}>
            התנתקות
          </button>
        </div>
      )}

      {clientMode === "SUPPLIER" && (
        <div className={styles.buttonsContainer}>
          <h1>{`שלום ${currentSupplier?.providerName}`}</h1>
          <button className={styles.registerButton} onClick={handleDisconnect}>
            התנתקות
          </button>
        </div>
      )}
    </>
  );
};

export default TopBarButtons;
