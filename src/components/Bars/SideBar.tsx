"use client";
import React from "react";
import useGeneralStore from "@/stores/generalStore";
import useUserStore from "@/stores/usersStore";
import useSupplierStore from "@/stores/supplierStore";
import styles from "@/styles/Bars/SideBar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import linkStiles from "@/styles/Bars/Links.module.css";

const SideBar = () => {
  const { clientMode } = useGeneralStore();
  const pathname = usePathname();
  let currentSupplierId = "0";
  let currentSUserId = "0";
  const { supplier } = useSupplierStore();
  const { user } = useUserStore();

  if (clientMode === "SUPPLIER" && supplier !== null) {
    currentSupplierId = supplier._id;
  }

  if (clientMode === "USER" && user !== null) {
    currentSUserId = user._id;
  }

  const userButtons = [
    { label: "ההטבות שלי", link: `/benefits/${currentSUserId}` },
    { label: "המועדונים שלי", link: `/clubs/${currentSUserId}` },
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
            className={`${linkStiles.barItem} ${pathname === button.link ? linkStiles.active : ""
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
            className={`${linkStiles.barItem} ${pathname === button.link ? linkStiles.active : ""
              }`}
          >
            {button.label}
          </Link>
        ))}
    </div>
  );
};

export default SideBar;
