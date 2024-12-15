"use client";
import React from "react";
import useGeneralStore from "@/stores/generalStore";
import styles from "@/styles/Bars/SideBar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
//import linkStiles from "@/styles/Bars/Links.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGift,
  faCreditCard,
  faBookmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const { clientMode, currentSupplier, currentUser } = useGeneralStore();
  const pathname = usePathname();
  let currentSupplierId = "0";
  let currentUserId = "0";

  if (clientMode === "SUPPLIER" && currentSupplier) {
    currentSupplierId = currentSupplier._id || "0";
  }

  if (clientMode === "USER" && currentUser !== null) {
    currentUserId = currentUser._id || "0";
  }

  const userButtons = [
    { label: "ההטבות שלי", link: `/benefits/${currentUserId}`, icon: faGift },
    { label: "המועדונים שלי", link: `/clubs/${currentUserId}`, icon: faCreditCard },
    { label: "שמורים", link: `/benefits/${currentUserId}/saved-benefits`, icon: faBookmark },
    { label: "פרטים אישיים", link: "/personalDetails", icon: faUser },
  ];

  if (clientMode !== "USER" && clientMode !== "SUPPLIER") {
    return null;
  }

  return (
    <div className={styles.sidebar}>
      {clientMode === "USER" &&
        userButtons.map((button, index) => (
          <Link
            key={index}
            href={button.link}
            className={`${styles.barItem} ${
              pathname === button.link ? styles.active : ""
            }`}
          >
            <FontAwesomeIcon icon={button.icon} className={styles.icon} />
            {button.label}
          </Link>
        ))}
    </div>
  );
};

export default SideBar;
