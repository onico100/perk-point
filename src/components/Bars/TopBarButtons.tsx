import React from "react";
import styles from '@/styles/Bars/TopBar.module.css'

const TopBarButtons: React.FC = () => {
  return (
    <div className={styles.buttonsContainer}>
      <button className={styles.loginButton}>התחברות</button>
      <button className={styles.registerButton}>הרשמה</button>
    </div>
  );
};

export default TopBarButtons;
