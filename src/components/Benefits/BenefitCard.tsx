"use client";

import React from "react";

import styles from "@/styles/Benefits/benefitCard.module.css";
import { useParams, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { BsPin, BsPinAngleFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { TbCalendarOff } from "react-icons/tb";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { beforeActionAlert, errorAlert } from "@/utils/sweet-alerts";
import { getVaildBenefits } from "@/utils/benefitsUtils";
import { useUpdateUserById } from "@/hooks/useFetchUsers";
import YourBenefit from "./YourBenefit";
import { Benefit } from "@/types/BenefitsTypes";
import { Supplier } from "@/types/SupplierTypes";
import { Club } from "@/types/ClubTypes";
import { increaseBenefit } from "@/services/benefitsServices";

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
  const { currentUser, currentSupplier } = useGeneralStore();
  const { mutate: updateUser } = useUpdateUserById();
  const { deleteBenefit } = useFetchBenefits();

  const isExpired = getVaildBenefits([benefit]).length == 0;

  const isClubApi = club ? club.APIData : false;

  const id = params.clientId;
  const { clientMode } = useGeneralStore();

  const goToBenefitDetails = () => {
    increaseBenefit(benefit._id || "", Boolean(isClubApi));
    router.push(`/benefits/0/${benefit._id}`);
  };

  const deleteBenefitFunc = async () => {
    let alertConfirm = await beforeActionAlert("לא תוכל לשחזר לאחר מחיקה");
    alertConfirm && benefit._id && deleteBenefit(benefit._id);
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
      {currentSupplier?._id == benefit.supplierId && id == "0" && (
        <div className={styles.yourBenefit}>
          <YourBenefit></YourBenefit>
        </div>
      )}
      <div className={styles.clubName}>{club?.clubName.substring(0, 18)}</div>

      {id != "0" &&
        clientMode == "USER" &&
        (currentUser?.savedBenefits?.some(
          (existingBenefit) => existingBenefit === benefit?._id
        ) ? (
          <div className={styles.favoriteIcon} onClick={deleteFromFavorits}>
            <BsPinAngleFill />
          </div>
        ) : (
          <div className={styles.favoriteIcon} onClick={addToFavorits}>
            <BsPin />
          </div>
        ))}

      {(clientMode == "ADMIN" || (id != "0" && clientMode == "SUPPLIER")) && (
        <div
          className={`${styles.deleteButton} ${
            isClubApi ? styles.disabled : ""
          }`}
          onClick={!isClubApi ? deleteBenefitFunc : undefined}
          title={isClubApi ? "רק המועדון יכול למחוק" : ""}
        >
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
