"use client";

import React from "react";
import { Benefit, Supplier } from "@/types/types";
import styles from "@/styles/Benefits/benefitCard.module.css";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useRouter } from "next/navigation";

interface BenefitsCardProps {
  benefit: Benefit;
}

const BenefitsCard: React.FC<BenefitsCardProps> = ({ benefit }) => {
  const router = useRouter();
  const { suppliers } = useFetchSuppliers();

  const specificSupplier: Supplier | undefined = suppliers?.find(
    (supplier:Supplier) => supplier._id === benefit?.supplierId
  );

const goToBenefitDetails=()=>{
  router.push(`/benefits/0/${benefit._id}`);
}

  return (
    <div className={styles.benefitCard}>
      {specificSupplier && specificSupplier.supplierLogo ? (
        <img
          src={specificSupplier.supplierLogo}
          alt="Brand Logo"
          className={styles.logo}
        />
      ) : (
        <div></div>
      )}
      <hr className={styles.divider} />
      <p className={styles.description}>{benefit.description}</p>
      <div>{specificSupplier?.providerName}</div>
      <button className={styles.button} onClick={goToBenefitDetails}>מעבר להטבה</button>
    </div>
  );
};

export default BenefitsCard;
