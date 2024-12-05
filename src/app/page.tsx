"use client";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, PreMode } from "@/types/types";
import HomeComp from "@/components/Home/HomeComp";

export default function Home() {
  const setClientMode = useGeneralStore((state) => state.setClientMode);

  const { clientMode } = useGeneralStore();

  if (clientMode === ClientMode.connection) {
    setClientMode(ClientMode.general);
  }

  return (
    <div>
      <HomeComp />
    </div>
  );
}
