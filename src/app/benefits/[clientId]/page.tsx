"use client";
import { BenefitsContainer, LoadingSpinner } from "@/components";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/Generaltypes";
import { useParams } from "next/navigation";
import { getVaildBenefits } from "@/utils/benefitsUtils";
import React from "react";
import { Benefit } from "@/types/BenefitsTypes";

export default function ClientId() {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { currentUser, clientMode } = useGeneralStore();

  const titles = ["כל ההטבות", "ההטבות שלי", "הטבות החברה"];
  const params = useParams();
  const id = params.clientId;

  if (clientMode === ClientMode.connection) setClientMode(ClientMode.general);

  let benefitsToShow: Benefit[] = [];
  let currentTitle = titles[0];

  if (benefits) {
    benefitsToShow = benefits;
    if (id !== "0") {
      if (clientMode === "USER") {
        benefitsToShow =
          benefits.filter((b) => currentUser?.clubs.includes(b.clubId)) || [];
        currentTitle = titles[1];
      } else if (clientMode === "SUPPLIER") {
        benefitsToShow = benefits.filter((b) => b.supplierId === id) || [];
        currentTitle = titles[2];
      }
    } else if (clientMode != "ADMIN")
      benefitsToShow = getVaildBenefits(benefits);
  }

  if (isLoadingB || isFetchingB) return <LoadingSpinner />;

  return <BenefitsContainer benefits={benefitsToShow} title={currentTitle} />;
}
