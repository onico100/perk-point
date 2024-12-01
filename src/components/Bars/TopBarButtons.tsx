import React, { useState } from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import { ModePopup } from "../index";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";

const TopBarButtons: React.FC = () => {
  const { clientMode, currentSupplier, currentUser } = useGeneralStore();

  const [popupVisible, setPopupVisible] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setAnchorElement(null);
  };

  const handleDisconnect = () => {
    const setClientMode = useGeneralStore.getState().setClientMode;
    setClientMode(ClientMode.general);
    const setCurrentSupplier = useGeneralStore.getState().setCurrentSupplier;
    setCurrentSupplier(null);
    const setCurrentUser = useGeneralStore.getState().setCurrentUser;
    setCurrentUser(null);
    setPopupVisible(false);
    setAnchorElement(null);
  };

  return (
    <>
      {clientMode === "GENERAL" && (
        <div className={styles.buttonsContainer}>
          <button className={styles.loginButton} onClick={handleButtonClick}>
            התחברות
          </button>
          <button className={styles.registerButton} onClick={handleButtonClick}>
            הרשמה
          </button>
          {popupVisible && (
            <ModePopup
              onClose={handleClosePopup}
              anchorElement={anchorElement}
            />
          )}
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
