"use client";

import React from "react";
import {Club } from "@/types/types";
import styles from "@/styles/Clubs/ClubCard.module.css";
import { useParams, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";

interface ClubCardProps {
  club: Club;
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const router = useRouter();
  const params = useParams();

  const addClub = () => {};
  const deleteClub = () => {};

  const id = params.clientId;
  const { clientMode } = useGeneralStore();

  return (
    <div className={styles.clubCard}>
      <img src={club.clubLogo} alt="Brand Logo" className={styles.logo} />
      <hr className={styles.divider} />
      <div className={styles.name}>{club.clubName}</div>
      <p className={styles.link} onClick={() => window.open(club.clubLink, "_blank")}>
        {club.clubLink}
      </p>
      {clientMode === "USER" && (
        id === "0" ? (
          <div onClick={addClub}>Add Club</div> // כפתור להוספת מועדון
        ) : (
          <div>
            <div onClick={deleteClub}>Delete</div> {/* כפתור למחיקת מועדון */}
          </div>
        )
      )}
    </div>
  );
};

export default ClubCard;
