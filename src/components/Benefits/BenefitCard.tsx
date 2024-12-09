"use client";

import React from "react";
import { Benefit, Club, Supplier } from "@/types/types";
import styles from "@/styles/Benefits/benefitCard.module.css";

import { useParams, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { MdDelete } from "react-icons/md";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import {
  beforeActionAlert,
  errorAlert,
  successAlert,
} from "@/utils/sweet-alerts";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";

import { useUpdateUserById } from "@/hooks/useFetchUsers";

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
  const { currentUser } = useGeneralStore();
  const { mutate: updateUser, error } = useUpdateUserById();

  const { deleteBenefit } = useFetchBenefits();

  const id = params.clientId;
  const { clientMode } = useGeneralStore();

  const goToBenefitDetails = () => {
    router.push(`/benefits/0/${benefit._id}`);
  };

  const deleteBenefitFunc = async () => {
    let alertConfirm = await beforeActionAlert(
      "לא תוכל לשחזר לאחר מחיקה",
      "מחיקה"
    );

    if (alertConfirm) {
      if (benefit._id) deleteBenefit(benefit._id);
    }
  };

  const addToFavorits = async () => {
    let alertConfirm = await beforeActionAlert("", "הוספה");
    if (alertConfirm) {
      if (
        currentUser?.savedBenefits?.some(
          (existingBenefit) => existingBenefit === benefit?._id
        )
      ) {
        errorAlert("הטבה זו כבר שמורה אצלך.");
        return;
      }

      if (typeof currentUser?._id === "string") {
        await updateUser({
          id: currentUser?._id,
          updatedData: {
            username: currentUser?.username,
            email: currentUser?.email,
            clubs: currentUser?.clubs,
            registrationDate: currentUser?.registrationDate,
            savedBenefits: [
              ...(currentUser?.savedBenefits || []),
              benefit._id || "0",
            ],
            city: currentUser?.city,
            isActive: currentUser?.isActive,
            password: currentUser?.password,
          },
        });
      }
      successAlert(" נוסף לשמורים ");
    }
  };

  const deleteFromFavorits = async () => {
    let alertConfirm = await beforeActionAlert("", "הסרה משמורים");
    if (alertConfirm) {
      if (typeof currentUser?._id === "string") {
        await updateUser({
          id: currentUser?._id,
          updatedData: {
            username: currentUser?.username,
            email: currentUser?.email,
            clubs: currentUser?.clubs,
            registrationDate: currentUser?.registrationDate,
            savedBenefits: currentUser?.savedBenefits.filter(
              (b) => b != benefit._id
            ),
            city: currentUser?.city,
            isActive: currentUser?.isActive,
            password: currentUser?.password,
          },
        });
      }
      successAlert(" הוסר משמורים");
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

      {id != "0" &&
        clientMode == "USER" &&
        (currentUser?.savedBenefits?.some(
          (existingBenefit) => existingBenefit === benefit?._id
        ) ? (
          <div className={styles.favoriteIcon} onClick={deleteFromFavorits}>
            <MdFavorite />
          </div>
        ) : (
          <div className={styles.favoriteIcon} onClick={addToFavorits}>
            <MdFavoriteBorder />
          </div>
        ))}

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
