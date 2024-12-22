"use client";

import { useState } from "react";
import ContactManagement from "./contactManagement";
//import SupplierManagement from "@/components/SupplierManagement";
//import CustomerManagement from "@/components/CustomerManagement"; 
import styles from "@/styles/admin/dashboard.module.css";
import SupplierManagement from "./supplierManagement";

const DashboardComp = () => {
  const [activeComponent, setActiveComponent] = useState<string>("");

  const renderComponent = () => {
    switch (activeComponent) {
      case "contact":
        return <ContactManagement />;
       case "supplier":
         return <SupplierManagement />;
    //   case "customer":
    //     return <CustomerManagement />;
      default:
        return <p>בחר פעולה מתוך לוח הניהול.</p>;
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1>לוח ניהול</h1>
      <div className={styles.buttonsContainer}>
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
          onClick={() => setActiveComponent("customer")}
        >
          ניהול לקוחות
        </button>
      </div>
      <div className={styles.contentContainer}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default DashboardComp;
