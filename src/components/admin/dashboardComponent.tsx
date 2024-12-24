"use client";

import { useState } from "react";
import ContactManagement from "./contactManagement";
import styles from "@/styles/admin/dashboard.module.css";
import SupplierManagement from "./supplierManagement";
import UsersManagement from "./usersManagement";
import ClubsContactsManagement from "./clubsManagament";

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
      case "clubs_contacts":
        return <ClubsContactsManagement />;
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
          onClick={() => setActiveComponent("clubs_contacts")}
        >
          רישומי מועדון
        </button>

      </div>
      <div className={styles.contentContainer}>{renderComponent()}</div>
    </div>
  );
};

export default DashboardComp;
