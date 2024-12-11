"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";
import { useRouter } from "next/navigation";
import { PiUserCircleThin } from "react-icons/pi";

const TopBarButtons: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Set to true if scrolled 50px down
      } else {
        setIsScrolled(false); // Reset if back to top
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
    router.push("/");
  };

  const handleConnectionMode = (path: string) => {
    //setClientMode(ClientMode.connection);
    router.push(path);
  };

  return (
    <>
      {clientMode === "GENERAL" && (
        <div
          className={`${styles.buttonContainer} ${
            isScrolled ? styles.buttonContainerScrolled : ""
          }`}
        >
          <button
            className={`${styles.loginButton} ${
              isScrolled ? styles.loginButtonScrolled : ""
            }`}
            onClick={() => handleConnectionMode("/login-user")}
          >
            <PiUserCircleThin className={styles.icon} />
          </button>
          <button
            className={`${styles.signupButton} ${
              isScrolled ? styles.signupButtonScrolled : ""
            }`}
            onClick={() => handleConnectionMode("/login-supplier")}
          >
            כניסת ספקים
          </button>
        </div>
      )}

      {clientMode === "USER" && (
        <div
          className={`${styles.buttonContainer} ${
            isScrolled ? styles.buttonContainerScrolled : ""
          }`}
        >
          <h1>{currentUser?.username}</h1>
          <button
            className={`${styles.signupButton} ${
              isScrolled ? styles.signupButtonScrolled : ""
            }`}
            onClick={handleDisconnect}
          >
            התנתקות
          </button>
        </div>
      )}

      {clientMode === "SUPPLIER" && (
        <div
          className={`${styles.buttonContainer} ${
            isScrolled ? styles.buttonContainerScrolled : ""
          }`}
        >
          <h1>{currentSupplier?.providerName}</h1>
          <button
            className={`${styles.signupButton} ${
              isScrolled ? styles.signupButtonScrolled : ""
            }`}
            onClick={handleDisconnect}
          >
            התנתקות
          </button>
        </div>
      )}
    </>
  );
};

export default TopBarButtons;
