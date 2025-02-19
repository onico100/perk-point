"use client";
import { Club } from "@/types/ClubTypes";
import styles from "@/styles/Clubs/ClubsContainer.module.css";
import { useState } from "react";
import {
  SearchContainer,
  InputContainer,
  SearchIcon,
  NoClubsMessage,
} from "./SearchClubs.Styles";
import { ClubCard, TextInputFilter } from "@/components";

interface ClubsContainerProps {
  clubs: Club[];
  title: string;
}

const ClubsContainer = ({ clubs, title }: ClubsContainerProps) => {
  const [clubsToShow, setClubsToShow] = useState<Club[]>(clubs);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredClubs = clubs.filter((club) =>
      club.clubName.toLowerCase().includes(query.toLowerCase())
    );
    setClubsToShow(filteredClubs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBarContainer}>
        <SearchContainer>
          <InputContainer>
            <TextInputFilter
              placeholder="חיפש מועדון"
              value={searchQuery}
              onChange={handleSearch}
            />
            <SearchIcon />
          </InputContainer>
        </SearchContainer>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.clubsContainer}>
          {clubsToShow.length === 0 ? (
            <NoClubsMessage>לא נמצאו מועדונים</NoClubsMessage>
          ) : (
            clubsToShow?.map((club: Club) => (
              <ClubCard key={club._id} club={club}></ClubCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubsContainer;
