"use client";

import React from "react";
import { Benefit, Club, Supplier } from "@/types/types";
import styles from "@/styles/Clubs/ClubCard.module.css";
import { useRouter } from "next/navigation";

interface ClubCardProps {
  club: Club;
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const router = useRouter();

  const addClub = () => {};
  const deleteClub = () => {};
  const updateClub = () => {};

  return (
    <div className={styles.clubCard}>
      <img
        src={club.clubLogo}
        alt="Brand Logo"
        className={styles.logo}
      />
      <hr className={styles.divider} />
      <div className={styles.name}>{club.clubName}</div>
      <p className={styles.link} onClick={() => window.open(club.clubLink, "_blank")}>{club.clubLink}</p>
    </div>
  );
};

export default ClubCard;
