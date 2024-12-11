"use client";

import React from "react";
import { Benefit, Club, Supplier } from "@/types/types";
import styles from "@/styles/Benefits/benefitCard.module.css";

import { useParams, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { MdDelete, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { TbCalendarOff } from "react-icons/tb";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import {
  beforeActionAlert,
  errorAlert,
  successAlert,
} from "@/utils/sweet-alerts";

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
  const { mutate: updateUser } = useUpdateUserById();
  const { deleteBenefit } = useFetchBenefits();
  const isExpired: boolean = new Date(benefit.expirationDate) < new Date();

  const id = params.clientId;
  const { clientMode } = useGeneralStore();

  const goToBenefitDetails = () => {
    router.push(`/benefits/0/${benefit._id}`);
  };

  const deleteBenefitFunc = async () => {
    let alertConfirm = await beforeActionAlert(
      "לא תוכל לשחזר לאחר מחיקה",
    );

    if (alertConfirm) {
      if (benefit._id) deleteBenefit(benefit._id);
    }
  };

  const addToFavorits = async () => {
    let alertConfirm = await beforeActionAlert("");
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
      successAlert(" נוסף לשמורים בהצלחה! ");
    }
  };

  const deleteFromFavorits = async () => {
    let alertConfirm = await beforeActionAlert("");
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
      successAlert(" הוסר משמורים בהצלחה!");
    }
  };

  return (
    <div className={`${styles.benefitCard} ${isExpired ? styles.expierd : ""}`}>
      {isExpired && (
        <div className={styles.expiredOverlay}>
          <TbCalendarOff className={styles.expiredIcon} />
        </div>
      )}
      {supplier && supplier.supplierLogo ? (
        <img
          src={supplier.supplierLogo}
          alt="Brand Logo"
          className={styles.logo}
        />
      ) : (
        <div className={styles.logo}></div>
      )}
      <hr className={styles.divider} />
      <p className={styles.description}>
        {" "}
        {benefit.description.substring(0, 16)}
      </p>
      <div className={styles.clubName}>{club?.clubName.substring(0, 20)}</div>

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
