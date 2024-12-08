"use client";
import React from "react";
import useGeneralStore from "@/stores/generalStore";
import styles from "@/styles/Bars/SideBar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import linkStiles from "@/styles/Bars/Links.module.css";
import { link } from "fs";

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
    { label: "ההטבות שלי", link: `/benefits/${currentUserId}` },
    { label: "המועדונים שלי", link: `/clubs/${currentUserId}` },
    { label: "שמורים", link: `/benefits/${currentUserId}/saved-benefits` },
    { label: "פרטים אישיים", link: "/personalDetails" },
  ];

  const supplierButtons = [
    { label: "הטבות החברה", link: `/benefits/${currentSupplierId}` },
    { label: "פרטים אישיים", link: "/personalDetails" },
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
            className={`${linkStiles.barItem} ${
              pathname === button.link ? linkStiles.active : ""
            }`}
          >
            {button.label}
          </Link>
        ))}
      {clientMode === "SUPPLIER" &&
        supplierButtons.map((button, index) => (
          <Link
            key={index}
            href={button.link}
            className={`${linkStiles.barItem} ${
              pathname === button.link ? linkStiles.active : ""
            }`}
          >
            {button.label}
          </Link>
        ))}
    </div>
  );
};

export default SideBar;
