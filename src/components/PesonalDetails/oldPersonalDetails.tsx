"use client";

import styles from "@/styles/PersonalDetails.module.css";
import useGeneralStore from "@/stores/generalStore";
import LoadingSpinner from "../Loading/LoadingSpinner";

export default function PersonalDetails() {
  const { currentUser, currentSupplier} = useGeneralStore();

  if (!currentUser && !currentSupplier) {
    return <LoadingSpinner />;
  }

  if (currentUser) {
    return (
      <div className={styles.container}>
        <h2 className={styles.header}>פרטי משתמש</h2>
        <p className={styles.item}>
          <span className={styles.label}>שם משתמש:</span> {currentUser.username}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>אימייל:</span> {currentUser.email}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>עיר:</span> {currentUser.city}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>תאריך הרשמה:</span>{" "}
          {new Date(currentUser.registrationDate).toLocaleDateString("he-IL")}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>מועדונים:</span>{" "}
          {currentUser.clubs.join(", ") || "אין מועדונים"}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>הטבות שמורות:</span>{" "}
          {currentUser.savedBenefits.join(", ") || "אין הטבות שמורות"}
        </p>
      </div>
    );
  }

  if (currentSupplier) {
    return (
      <div className={styles.container}>
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
    );
  }
}
