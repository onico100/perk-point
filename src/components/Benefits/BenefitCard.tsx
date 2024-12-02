"use client";

import React from "react";
import { Benefit, Club, Supplier } from "@/types/types";
import styles from "@/styles/Benefits/benefitCard.module.css";
import { useParams, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { RiDeleteBinLine } from "react-icons/ri";

interface BenefitsCardProps {
  benefit: Benefit;
  supplier:Supplier | undefined
  club: Club
}

const BenefitsCard: React.FC<BenefitsCardProps> = ({ benefit, supplier, club }) => {
const router = useRouter();
const params = useParams();

const id = params.clientId;
const {clientMode } = useGeneralStore();

const goToBenefitDetails=()=>{
  router.push(`/benefits/0/${benefit._id}`);
}

const deleteBenefit=()=>{
  alert("are you sure you want to delete?")
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
      {(id!="0" && clientMode=='SUPPLIER') &&<div className={styles.deleteButton} onClick={deleteBenefit}><RiDeleteBinLine/></div>}
      <button className={styles.button} onClick={deleteBenefit}>מעבר להטבה</button>
    </div>
  );
};

export default BenefitsCard;
