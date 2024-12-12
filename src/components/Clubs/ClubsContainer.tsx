"use client";
import { Club } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Clubs/ClubsContainer.module.css";
import useGeneralStore from "@/stores/generalStore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  SearchContainer,
  InputContainer,
  ClubInput,
  SearchIcon,
} from "./SearchClubs.Styles";
import { LoadingSpinner, ClubCard } from "@/components";

interface ClubsContainerProps {
  clubs: Club[];
  title: string;
}

const ClubsContainer = ({ clubs, title }: ClubsContainerProps) => {
  const [clubsToShow, setClubsToShow] = useState<Club[]>(clubs);
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className={styles.title}>{title}</div>
        <div className={styles.clubsContainer}>
          {clubsToShow?.map((club: Club) => (
            <ClubCard key={club._id} club={club}></ClubCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubsContainer;
