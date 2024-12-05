"use client";

import React from "react";
import { Club, User } from "@/types/types";
import styles from "@/styles/Clubs/ClubCard.module.css";
import { useParams, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { useUpdateUserById } from "@/hooks/useFetchUsers";
import {beforeActionAlert, successAlert, errorAlert} from "@/utils/sweet-alerts";

interface ClubCardProps {
  club: Club;
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const params = useParams();

  const id = params.clientId;
  const { currentUser, clientMode, setCurrentUser } = useGeneralStore();
  const { mutate: updateUser, error } = useUpdateUserById();


  const addClub = async() => {
    let alertConfirm= await beforeActionAlert("","הוספה")
    if (alertConfirm) {
      if (
        currentUser?.clubs?.some((existingClub) => existingClub === club?._id)
      ) {
        errorAlert("מועדון זה כבר קיים אצלך.")
        return;
      }

      if (typeof currentUser?._id === "string") {
        await updateUser({
          id: currentUser?._id,
        updatedData: {
          username: currentUser?.username,
          email: currentUser?.email,
          clubs:  [...(currentUser?.clubs || []), club._id],
          registrationDate: currentUser?.registrationDate,
          savedBenefits: currentUser?.savedBenefits,
          city: currentUser?.city,
          isActive: currentUser?.isActive,
          password: currentUser?.password, 
        },
        });
      }
      successAlert("מועדון נוסף")
    }
  };

  const deleteClub = async() => {
    let alertConfirm= await beforeActionAlert("","הסרה")
    if (alertConfirm) {
      if (typeof currentUser?._id === "string") {
        await updateUser({
           id: currentUser?._id,
         updatedData: {
           username: currentUser?.username,
           email: currentUser?.email,
           clubs:currentUser?.clubs.filter(c =>c !=club._id),
           registrationDate: currentUser?.registrationDate,
           savedBenefits: currentUser?.savedBenefits,
           city: currentUser?.city,
           isActive: currentUser?.isActive,
           password: currentUser?.password, 
         },
         });
       }
       successAlert("הוסר")
    }
  };

  return (
    <div className={styles.clubCard}>
      <img src={club.clubLogo} alt="Brand Logo" className={styles.logo} />
      <hr className={styles.divider} />
      <div className={styles.name}>{club.clubName}</div>
      <p
        className={styles.link}
        onClick={() => window.open(club.clubLink, "_blank")}
      >
        {club.clubLink}
      </p>
      {clientMode === "USER" &&
        (id === "0" ? (
          <button className={styles.button} onClick={addClub}>
            הוספה למועדונים שלי
          </button>
        ) : (
          <div>
            <button className={styles.deleteButton} onClick={deleteClub}>
              הסרה
            </button>
          </div>
        ))}
    </div>
  );
};

export default ClubCard;
