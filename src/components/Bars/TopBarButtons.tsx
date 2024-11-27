import React from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import useGeneralStore from "@/stores/generalStore";
import useUserStore from "@/stores/usersStore";
import useSupplierStore from "@/stores/supplierStore";

const TopBarButtons: React.FC = () => {
  const { clientMode } = useGeneralStore();
  const { supplier } = useSupplierStore();
  const { user } = useUserStore();
  return (
    <>
      {clientMode === "GENERAL" && (
        <div className={styles.buttonsContainer}>
          <button className={styles.loginButton}>התחברות</button>
          <button className={styles.registerButton}>הרשמה</button>
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
