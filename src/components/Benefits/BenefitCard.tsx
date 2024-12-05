"use client";

import React from "react";
import { Benefit, Club, Supplier } from "@/types/types";
import styles from "@/styles/Benefits/benefitCard.module.css";

import { useParams, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { MdDelete } from "react-icons/md";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { beforeActionAlert } from "@/utils/sweet-alerts";

interface BenefitsCardProps {
  benefit: Benefit;
  supplier: Supplier | undefined;
  club: Club;
}

const BenefitsCard: React.FC<BenefitsCardProps> = ({
  benefit,
  supplier,
  club,
}) => {
  const router = useRouter();
  const params = useParams();

  const { deleteBenefit } = useFetchBenefits();

  const id = params.clientId;
  const { clientMode } = useGeneralStore();

  const goToBenefitDetails = () => {
    router.push(`/benefits/0/${benefit._id}`);
  };

  const deleteBenefitFunc =async () => {
    let alertConfirm= await beforeActionAlert("לא תוכל לשחזר לאחר מחיקה","מחיקה")

    if (alertConfirm) {
    if(benefit._id)
      deleteBenefit(benefit._id);
    }
  };

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

      {id != "0" && clientMode == "SUPPLIER" && (
        <div className={styles.deleteButton} onClick={deleteBenefitFunc}>
          <MdDelete />
        </div>
      )}
      <button className={styles.button} onClick={goToBenefitDetails}>
        מעבר להטבה
      </button>
    </div>
  );
};

export default BenefitsCard;
