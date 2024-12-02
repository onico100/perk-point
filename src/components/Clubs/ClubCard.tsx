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
  const { clientMode, currentUser, setCurrentUser } = useGeneralStore();
  const { mutate: updateUser, error } = useUpdateUserById();
  
  console.log("currentUser000: " + currentUser);
  const addClub = () => {
    if (window.confirm("Are you sure you want to add this club?")) {
      if (
        currentUser?.clubs?.some((existingClub) => existingClub === club?._id)
      ) {
        alert("This club has already been added.");
        return;
      }
      console.log("currentUser: " + currentUser);
      const updatedUser = {
        ...currentUser,
        clubs: [...(currentUser?.clubs || []), club],
      } as User;

      console.log("updatedUser: " + updatedUser);
      console.log("currentUser: " + currentUser);

      setCurrentUser(updatedUser);
      if (typeof currentUser?._id === "string") {
        updateUser({
          id: currentUser?._id,
          updatedData: { clubs: updatedUser.clubs },
        });
      }
      alert("club added successfully")
    }
  };

  const deleteClub = () => {
    if (window.confirm("Are you sure you want to delete this club?")) {
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
          <button className={`${styles.button} ${styles.addButton}`} onClick={addClub}>Add Club</button>
        ) : (
          <div>
            <button className={`${styles.button} ${styles.deleteButton}`} onClick={deleteClub}>Delete</button>
          </div>
        ))}
    </div>
  );
};

export default ClubCard;
