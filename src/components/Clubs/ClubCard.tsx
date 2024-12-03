"use client";

import React from "react";
import { Club, User } from "@/types/types";
import styles from "@/styles/Clubs/ClubCard.module.css";
import { useParams, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { useUpdateUserById } from "@/hooks/useFetchUsers";

interface ClubCardProps {
  club: Club;
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const params = useParams();

  const id = params.clientId;
  const { currentUser, clientMode, setCurrentUser } = useGeneralStore();
  const { mutate: updateUser, error } = useUpdateUserById();


  const addClub = async() => {
    if (window.confirm("Are you sure you want to add this club?")) {
      if (
        currentUser?.clubs?.some((existingClub) => existingClub === club?._id)
      ) {
        alert("This club has already been added.");
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
      alert("club added successfully");
    }
  };

  const deleteClub = async() => {
    if (window.confirm("Are you sure you want to delete this club?")) {
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
       alert("club deleted successfully");
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
