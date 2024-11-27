import React , { useState } from "react";
import "@/styles/Bars/TopBar.css";
import ModePopup from "./ModePopup";

import useGeneralStore from '@/stores/generalStore';


const TopBarButtons: React.FC = () => {

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
    <div className="buttons-container">
      <button className="login-button" onClick={handleButtonClick}>התחברות</button>
      <button className="register-button" onClick={handleButtonClick}>הרשמה</button>
      {popupVisible && <ModePopup onClose={handleClosePopup} anchorElement={anchorElement} />}
    </div>
  );
};

export default TopBarButtons;
