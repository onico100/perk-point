"use client";
import { BenefitsContainer } from "@/components";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, PreMode } from "@/types/types";

export default function savedBenefits() {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const { clientMode } = useGeneralStore();

  if (clientMode == ClientMode.connection) setClientMode(ClientMode.general);

  return <BenefitsContainer />;
}
