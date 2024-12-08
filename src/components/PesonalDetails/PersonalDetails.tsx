"use client";

import styles from "@/styles/PersonalDetails.module.css";
import useGeneralStore from "@/stores/generalStore";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { Benefit, Category, Club } from "@/types/types";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { ObjectId } from "mongodb";

export default function PersonalDetails() {
  const { currentUser, currentSupplier, categories } = useGeneralStore();

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
          <span className={styles.label}>שם ספק:</span>{" "}
          {currentSupplier.providerName}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>אימייל:</span> {currentSupplier.email}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>שם עסק:</span>{" "}
          {currentSupplier.businessName}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>מספר טלפון:</span>{" "}
          {currentSupplier.phoneNumber}
        </p>
        {currentSupplier.registrationDate && (
          <p className={styles.item}>
            <span className={styles.label}>תאריך הרשמה:</span>{" "}
            {new Date(currentSupplier.registrationDate).toLocaleDateString(
              "he-IL"
            )}
          </p>
        )}
        <p className={styles.item}>
          <span className={styles.label}>קטגוריות:</span>
          {categories
            ?.filter((category: Category) =>
              currentSupplier?.categories?.includes(new ObjectId(category._id))
            )
            .map((category: Category) => (
              <div key={category._id}>{category.categoryName}</div>
            )) || "אין קטגוריות"}
        </p>
        F
      </div>
    );
  }
}
