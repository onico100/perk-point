"use client";
import { BenefitsTry } from "@/components";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import { Benefit, ClientMode, PreMode } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientId() {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { currentUser, clientMode } = useGeneralStore();
  const [benefitsToShow, setBenefitsToShow] = useState<Benefit[]>([]);
  const titles = ["כל ההטבות", "ההטבות שלי", "הטבות החברה"];
  const [currentTitle, setCurrentTitle] = useState(titles[0]);
  const params = useParams();
  const id = params.clientId;
  useEffect(() => {
    if (id !== "0") {
      if (clientMode === "USER") {
        setBenefitsToShow(
          benefits?.filter((b: Benefit) =>
            currentUser?.clubs.includes(b.clubId)
          ) || []
        );
        setCurrentTitle(titles[1]);
      } else if (clientMode === "SUPPLIER") {
        console.log("supplierId: " + id);
        benefits?.forEach((element: any) => {
          console.log("b: " + element.supplierId);
        });
        setBenefitsToShow(
          benefits?.filter((b: Benefit) => b.supplierId == id) || []
        );
        setCurrentTitle(titles[2]);
      }
    } else {
      setBenefitsToShow(benefits || []);
    }
  }, [benefits, currentUser]);

  if (clientMode == ClientMode.connection) setClientMode(ClientMode.general);

  if (isLoadingB || isFetchingB) return <LoadingSpinner />;
  return <BenefitsTry benefits={benefitsToShow} title={currentTitle} />;
}
