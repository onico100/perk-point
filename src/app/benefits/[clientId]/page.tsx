"use client";
import { BenefitsContainer, LoadingSpinner } from "@/components";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import { Benefit, ClientMode } from "@/types/types";
import { useParams } from "next/navigation";

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
    if (id !== "0") {
      if (clientMode === "USER") {
        benefitsToShow =
          benefits.filter((b) => currentUser?.clubs.includes(b.clubId)) || [];
        currentTitle = titles[1];
      } else if (clientMode === "SUPPLIER") {
        benefitsToShow = benefits.filter((b) => b.supplierId === id) || [];
        currentTitle = titles[2];
      }
    } else {
      benefitsToShow =
        benefits.filter(
          (b) => b.expirationDate && new Date(b.expirationDate) >= new Date()
        ) || [];
    }
  }

  console.log(11, "benefits", benefits);
  console.log(11, "benefitstoshow", benefitsToShow);

  if (isLoadingB || isFetchingB) return <LoadingSpinner />;

  return <BenefitsContainer benefits={benefitsToShow} title={currentTitle} />;
}
