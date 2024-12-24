"use client";
import React from "react";
import TopBarButtons from "./TopBarButtons";
import Link from "next/link";
import logoLight from "@/assets/logoLight.png";
import linkStyle from "@/styles/Bars/Links.module.css";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/Bars/TopBar.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/Generaltypes";

const TopBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const clientMode = useGeneralStore((state) => state.clientMode);

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.rightSide}>
        <div className={styles.logoContainer}>
          <img
            src={logoLight.src}
            alt="Perk Point Logo"
            className={styles.logo}
            onClick={goToHome}
          />
        </div>
        <Link
          className={`${linkStyle.barItem}  ${
            pathname === "/benefits/0" ? linkStyle.active : ""
          }`}
          href={"/benefits/0"}
        >
          הטבות
        </Link>
        <Link
          className={`${linkStyle.barItem}  ${
            pathname === "/clubs/0" ? linkStyle.active : ""
          }`}
          href={"/clubs/0"}
        >
          מועדונים
        </Link>
        <Link
          className={`${linkStyle.barItem}  ${
            pathname === "/about" ? linkStyle.active : ""
          }`}
          href={"/about"}
        >
          אודות
        </Link>
        {clientMode === ClientMode.admin && (
          <Link
            className={`${linkStyle.barItem}  ${
              pathname === "/admin/dashboard" ? linkStyle.active : ""
            }`}
            href={"/admin/dashboard"}
          >
            לוח ניהול
          </Link>
        )}
      </div>
      <TopBarButtons />
    </div>
  );
};

export default TopBar;
