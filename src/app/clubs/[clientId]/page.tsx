"use client";
import { LoadingSpinner, ClubsContainer } from "@/components";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import useGeneralStore from "@/stores/generalStore";
import { Club } from "@/types/ClubTypes";
import { ClientMode } from "@/types/Generaltypes";
import { getActiveClubs } from "@/utils/clubsUtils";

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

  let clubsToShow: Club[] = [];
  let currentTitle = titles[0];

  if (clubs) {
    clubsToShow = getActiveClubs(clubs);
    if (id !== "0" && clientMode == "USER") {
      clubsToShow =
        clubsToShow.filter((c: Club) =>
          currentUser?.clubs?.includes(c._id || " ")
        ) || [];
      currentTitle = titles[1];
    }
  }

  if (isLoadingCategories || isFetchingCategories) return <LoadingSpinner />;

  return <ClubsContainer clubs={clubsToShow} title={currentTitle} />;
}
