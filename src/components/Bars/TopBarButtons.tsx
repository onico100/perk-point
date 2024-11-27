import React, { useState } from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import ModePopup from "./ModePopup";
import useGeneralStore from "@/stores/generalStore";
import useUserStore from "@/stores/usersStore";
import useSupplierStore from "@/stores/supplierStore";

const TopBarButtons: React.FC = () => {
  const { clientMode } = useGeneralStore();
  const { supplier } = useSupplierStore();
  const { user } = useUserStore();

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
          <h1>{`שלום ${user?.username}`}</h1>
          <button className={styles.registerButton}>התנתקות</button>
        </div>
      )}

      {clientMode === "SUPPLIER" && (
        <div className={styles.buttonsContainer}>
          <h1>{`שלום ${supplier?.providerName}`}</h1>
          <button className={styles.registerButton}>התנתקות</button>
        </div>
      )}
    </>
  );
};

export default TopBarButtons;
