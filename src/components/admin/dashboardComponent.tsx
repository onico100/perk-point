"use client";

import { useState } from "react";
import ContactManagement from "./contactManagement";
//import SupplierManagement from "@/components/SupplierManagement";
//import CustomerManagement from "@/components/CustomerManagement"; 
import styles from "@/styles/admin/dashboard.module.css";
import SupplierManagement from "./supplierManagement";
import UsersManagement from "./usersManagement";

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
      </div>
      <div className={styles.contentContainer}>{renderComponent()}</div>
    </div>
  );
};

export default DashboardComp;
