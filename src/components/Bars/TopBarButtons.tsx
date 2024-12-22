"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Bars/TopBar.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";
import { usePathname, useRouter } from "next/navigation";
import { PiUserCircleThin } from "react-icons/pi";
import { signOut } from "@/services/auth";
import { doLogout } from "../SignPages/actions";

const TopBarButtons: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const {
    clientMode,
    currentSupplier,
    currentUser,
    setClientMode,
    setCurrentUser,
    setCurrentSupplier,
  } = useGeneralStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDisconnect = async () => {    
    setClientMode(ClientMode.general);
    setCurrentSupplier(null);
    setCurrentUser(null);
    doLogout();
    router.push("/");
  };

  const handleConnectionMode = (path: string) => {
    router.push(path);
  };

  const isSpecialPath =
    pathName.includes("benefit") || pathName.includes("club");

  return (
    <>
      <div
        className={`${styles.buttonContainer} ${
          isScrolled ? styles.buttonContainerScrolled : ""
        } ${isSpecialPath ? styles.specialPath : ""}`}
      >
        {clientMode === "GENERAL" && (
          <>
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
          </>
        )}

        {clientMode === "USER" && (
          <>
            <h1>{currentUser?.username}</h1>
            <button
              className={`${styles.signupButton} ${
                isScrolled ? styles.signupButtonScrolled : ""
              }`}
              onClick={handleDisconnect}
            >
              התנתקות
            </button>
          </>
        )}

        {clientMode === "SUPPLIER" && (
          <>
            <h1>{currentSupplier?.providerName}</h1>
            <button
              className={`${styles.signupButton} ${
                isScrolled ? styles.signupButtonScrolled : ""
              }`}
              onClick={handleDisconnect}
            >
              התנתקות
            </button>
          </>
        )}        
        
        {clientMode === "ADMIN" && (
          <>
            <h1>ניהול האתר</h1>
            <button
              className={`${styles.signupButton} ${
                isScrolled ? styles.signupButtonScrolled : ""
              }`}
              onClick={handleDisconnect}
            >
              התנתקות
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default TopBarButtons;
