"use client";
import ClubCard from "@/components/Clubs/ClubCard";
import { Club } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Clubs/ClubsContainer.module.css";
import useGeneralStore from "@/stores/generalStore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SearchContainer, InputContainer, ClubInput, SearchIcon } from './SearchClubs.Styles'; 

const ClubsContainer = () => {
  const params = useParams();

  const { clubs, isLoadingC, isFetchingC } = useFetchGeneral();
  const { currentUser, clientMode } = useGeneralStore()
  const [clubsToShow, setClubsToShow] = useState<Club[]>([])
  const titles = ["כל המועדונים", "המועדונים שלי"];
  const [currentTitle, setCurrentTitle] = useState(titles[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const id = params.clientId;

  useEffect(() => {
    let filteredClubs = clubs || [];

    if (id !== "0") {
      if (clientMode === "USER") {
        filteredClubs = filteredClubs.filter((c: Club) =>
          currentUser?.clubs?.includes(c._id)
        );
        setCurrentTitle(titles[1]);
      }
    }

    if (searchQuery) {
      filteredClubs = filteredClubs.filter((club: Club) =>
        club.clubName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setClubsToShow(filteredClubs);
  }, [clubs, currentUser, searchQuery, clientMode, id]);


  if (isLoadingC || isFetchingC) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.searchBarContainer}>
        <SearchContainer>
          <InputContainer>
            <ClubInput
              type="text"
              placeholder="חיפש מועדון"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <SearchIcon />
          </InputContainer>
        </SearchContainer>
      </div>
      <div className={styles.mainContainer}>

        <div className={styles.title}>{currentTitle}</div>
        <div className={styles.clubsContainer}>
          {clubsToShow?.map((club: Club) => (
            <ClubCard
              key={club._id}
              club={club}
            ></ClubCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubsContainer;
