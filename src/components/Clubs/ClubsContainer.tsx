"use client";
import ClubCard from "@/components/Clubs/ClubCard";
import { Club, Supplier } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/clubs/ClubsContainer.module.css";

const ClubsContainer = () => {
  const { clubs ,isLoadingC,isFetchingC} = useFetchGeneral();
console.log(clubs)
  if (isLoadingC || isFetchingC) return <div>Loading...</div>;
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>כל הההטבות</div>
      <div className={styles.clubsContainer}>
        {clubs?.map((club:Club) => (
          <ClubCard
            key={club._id}
            club={club}
          ></ClubCard>
        ))}
      </div>
    </div>
  );
};

export default ClubsContainer;
