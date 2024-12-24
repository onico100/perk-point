"use client";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/Generaltypes";
import { HomeComp } from "@/components/index";

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
