import React from "react";
import "@/styles/Bars/TopBar.css";

const TopBarButtons: React.FC = () => {
  return (
    <div className="buttons-container">
      <button className="login-button">התחברות</button>
      <button className="register-button">הרשמה</button>
    </div>
  );
};

export default TopBarButtons;
