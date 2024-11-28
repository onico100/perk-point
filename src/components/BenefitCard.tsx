"use client";

import React, { useState } from "react";
import { Benefit } from "@/types/types"; 
import styles from "@/styles/benefitCard.module.css";
import useSupplierStore from "@/stores/supplierStore";

interface BenefitsCardProps {
  benefit: Benefit;
}

const BenefitsCard: React.FC<BenefitsCardProps> = ({ benefit }) => {
const {suppliers}=useSupplierStore()
const [supplier, setSupplier] =useState(suppliers.filter(s=>s._id==benefit.supplierId)[0])


  return (
    <div className={styles.benefitCard}>
      <img src={supplier?.supplierLogo} alt="Brand Logo" className={styles.logo} />
      <hr className={styles.divider} />
      <p className={styles.description}>{benefit.description}</p>
      <button className={styles.button}>מעבר להטבה</button>
    </div>
  );
};

export default BenefitsCard;
