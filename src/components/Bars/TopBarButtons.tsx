import React, { useState } from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import {ModePopup} from "../index";
import useGeneralStore from "@/stores/generalStore";

const TopBarButtons: React.FC = () => {
  const { clientMode,currentSupplier,currentUser } = useGeneralStore();
  const [popupVisible, setPopupVisible] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [actionType, setActionType] = useState<"login" | "register">("login");

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: "login" | "register"
  ) => {
    setAnchorElement(event.currentTarget);
    setActionType(type); // Update action type (login/register)
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setAnchorElement(null);
  };

  return (
    <>
      {clientMode === "GENERAL" && (
        <div className={styles.buttonsContainer}>
          <button className={styles.loginButton}onClick={(e) => handleButtonClick(e, "login")}>
            התחברות
          </button>
          <button className={styles.registerButton}onClick={(e) => handleButtonClick(e, "register")}>
            הרשמה
          </button>
          {popupVisible && (
            <ModePopup
            onClose={handleClosePopup}
            anchorElement={anchorElement}
            actionType={actionType} // Pass action type to ModePopup
          />
          )}
        </div>
      )}

      {clientMode === "USER" && (
        <div className={styles.buttonsContainer}>
          <h1>{`שלום ${currentUser?.username}`}</h1>
          <button className={styles.registerButton}>התנתקות</button>
        </div>
      )}

      {clientMode === "SUPPLIER" && (
        <div className={styles.buttonsContainer}>
          <h1>{`שלום ${currentSupplier?.providerName}`}</h1>
          <button className={styles.registerButton}>התנתקות</button>
        </div>
      )}
    </>
  );
};

export default TopBarButtons;
