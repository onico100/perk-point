"use client";
import { LoadingSpinner, ClubsContainer } from "@/components";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, Club } from "@/types/types";
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
    if (id !== "0" && clientMode == "USER") {
      clubsToShow =
        clubs.filter((c: Club) => currentUser?.clubs?.includes(c._id)) || [];
      currentTitle = titles[1];
    } else {
      clubsToShow = clubs;
      console.log("blaaaaaaaa");
    }
  }

  if (isLoadingCategories || isFetchingCategories) return <LoadingSpinner />;

  return <ClubsContainer clubs={clubsToShow} title={currentTitle} />;
}
