"use client";

import { useState } from "react";
import ContactManagement from "./contactManagement";
import SupplierManagement from "./supplierManagement";
import UsersManagement from "./usersManagement";
import styles from "@/styles/admin/dashboard.module.css";
import ClubsContactManagement from "./clubsContactManagement";

const DashboardComp = () => {
  const [activeComponent, setActiveComponent] = useState<string>("");

  const renderComponent = () => {
    switch (activeComponent) {
      case "contact":
        return <ContactManagement />;
      case "supplier":
        return <SupplierManagement />;
      case "users":
        return <UsersManagement />;      
      case "contacts_clubs":
        return <ClubsContactManagement />;
      default:
        return (
          <div className={styles.welcomeScreen}>
            <h1>ברוך הבא, מנהל</h1>
            <p>בחר אפשרות מתוך התפריט הימני</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <button
          className={styles.dashboardButton}
          onClick={() => setActiveComponent("contact")}
        >
          ניהול פניות
        </button>
        <button
          className={styles.dashboardButton}
          onClick={() => setActiveComponent("supplier")}
        >
          ניהול ספקים
        </button>
        <button
          className={styles.dashboardButton}
          onClick={() => setActiveComponent("users")}
        >
          ניהול לקוחות
        </button>
        <button
            className={styles.dashboardButton}
            onClick={() => setActiveComponent("contacts_clubs")}
        >
            ניהול רשומות מועדון
        </button>

      </div>
      <div className={styles.contentContainer}>{renderComponent()}</div>
    </div>
  );
};

export default DashboardComp;
