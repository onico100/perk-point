"use client"

import { Supplier } from "@/types/types";
import styles from "@/styles/PersonalDetails.module.css";

interface SupplierPersonalDetailsProps {
    currentSupplier: Supplier;
  }
  
  export default function SupplierPersonalDetails({ currentSupplier }: SupplierPersonalDetailsProps) {
    return  <div className={styles.container}>
    <h2 className={styles.header}>פרטי ספק</h2>
    {currentSupplier.supplierLogo && (
      <img
        src={currentSupplier.supplierLogo}
        alt="לוגו ספק"
        className={styles.logo}
      />
    )}
    <p className={styles.item}>
      <span className={styles.label}>שם ספק:</span> {currentSupplier.providerName}
    </p>
    <p className={styles.item}>
      <span className={styles.label}>אימייל:</span> {currentSupplier.email}
    </p>
    <p className={styles.item}>
      <span className={styles.label}>שם עסק:</span> {currentSupplier.businessName}
    </p>
    <p className={styles.item}>
      <span className={styles.label}>מספר טלפון:</span> {currentSupplier.phoneNumber}
    </p>
    {currentSupplier.registrationDate && (
      <p className={styles.item}>
        <span className={styles.label}>תאריך הרשמה:</span>{" "}
        {new Date(currentSupplier.registrationDate).toLocaleDateString("he-IL")}
      </p>
    )}
    <p className={styles.item}>
      <span className={styles.label}>קטגוריות:</span>{" "}
      {currentSupplier.categories?.join(", ") || "אין קטגוריות"}
    </p>
    <p className={styles.item}>
      <span className={styles.label}>לינק לאתר:</span>{" "}
      {currentSupplier.siteLink ? (
        <a
          href={currentSupplier.siteLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {currentSupplier.siteLink}
        </a>
      ) : (
        "אין אתר"
      )}
    </p>
  </div>
}