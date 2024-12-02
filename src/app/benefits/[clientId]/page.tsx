"use client";
import { BenefitsContainer } from "@/components";
import useGeneralStore from "@/stores/generalStore";

export default function ClientId() {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const setPreMode = useGeneralStore((state) => state.setPreMode);

  return <BenefitsContainer></BenefitsContainer>;
}
