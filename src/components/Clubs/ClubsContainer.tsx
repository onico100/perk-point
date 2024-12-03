"use client";
import ClubCard from "@/components/Clubs/ClubCard";
import { Club, Supplier } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Clubs/ClubsContainer.module.css";
import useGeneralStore from "@/stores/generalStore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


const ClubsContainer = () => {
  const params = useParams();

  const { clubs ,isLoadingC,isFetchingC} = useFetchGeneral();
  const {currentUser, clientMode}=useGeneralStore()
  const [clubsToShow, setClubsToShow]=useState<Club[]>([])
  const titles = ["כל המועדונים", "המועדונים שלי"];
  const [currentTitle, setCurrentTitle] = useState(titles[0]);
  const id = params.clientId;

  useEffect(() => {
    if (id !== "0") {
      if (clientMode === "USER") {
        setClubsToShow(
          clubs?.filter((c: Club) =>
            currentUser?.clubs?.includes(c._id)
          ) || []
        );
        setCurrentTitle(titles[1]);
      } 

    } else {
      setClubsToShow(clubs || []);
    }
  }, [clubs,currentUser]);


  if (isLoadingC || isFetchingC) return <div>Loading...</div>;
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>{currentTitle}</div>
      <div className={styles.clubsContainer}>
        {clubsToShow?.map((club:Club) => (
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
