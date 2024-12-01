"use client";

import React from "react";
import { Benefit, Club, Supplier } from "@/types/types";
import styles from "@/styles/Benefits/benefitCard.module.css";
import { useRouter } from "next/navigation";

interface BenefitsCardProps {
  benefit: Benefit;
  supplier:Supplier | undefined
  club: Club
}

const BenefitsCard: React.FC<BenefitsCardProps> = ({ benefit, supplier, club }) => {
  const router = useRouter();

const goToBenefitDetails=()=>{
  router.push(`/benefits/0/${benefit._id}`);
}

  return (
    <div className={styles.benefitCard}>
      {supplier && supplier.supplierLogo ? (
        <img
          src={supplier.supplierLogo}
          alt="Brand Logo"
          className={styles.logo}
        />
      ) : (
        <div></div>
      )}
      <hr className={styles.divider} />
      <p className={styles.description}>{benefit.description}</p>
      <div className={styles.clubName}>{club?.clubName}</div>
      <button className={styles.button} onClick={goToBenefitDetails}>מעבר להטבה</button>
    </div>
  );
};

export default BenefitsCard;
