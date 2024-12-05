"use client";
import ClubsContainer from "@/components/Clubs/ClubsContainer";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";
export default function Clubs() {
  const setClientMode = useGeneralStore((state) => state.setClientMode);

  const { clientMode } = useGeneralStore();

  if (clientMode == ClientMode.connection) setClientMode(ClientMode.general);

  return <ClubsContainer></ClubsContainer>;
}
