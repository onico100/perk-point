"use client";
import { LoadingSpinner, ClubsContainer } from "@/components";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, Club, ClubStatus } from "@/types/types";
import { get } from "http";
import { useParams } from "next/navigation";

export default function Clubs() {
  const params = useParams();
  const { clubs, isLoadingCategories, isFetchingCategories } =
    useFetchGeneral();
  const { currentUser, clientMode } = useGeneralStore();
  const titles = ["כל המועדונים", "המועדונים שלי"];
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  if (clientMode == ClientMode.connection) setClientMode(ClientMode.general);
  const id = params.clientId;

  const getActiveClubs = (clubs: Club[]) => {
    console.log(22, clubs);
    clubs.forEach((club) => {
      console.log(22, typeof club.clubStatus);
    });

    return clubs.filter((c: Club) => c.clubStatus == "ACTIVE");
  };

  let clubsToShow: Club[] = [];
  let currentTitle = titles[0];

  if (clubs) {
    console.log(clubs);
    if (id !== "0" && clientMode == "USER") {
      clubsToShow =
        clubs.filter((c: Club) => currentUser?.clubs?.includes(c._id)) || [];
      currentTitle = titles[1];
      clubsToShow = getActiveClubs(clubsToShow);
    } else {
      clubsToShow = getActiveClubs(clubs);
    }
  }

  if (isLoadingCategories || isFetchingCategories) return <LoadingSpinner />;

  return <ClubsContainer clubs={clubsToShow} title={currentTitle} />;
}
