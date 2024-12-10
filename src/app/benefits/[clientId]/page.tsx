"use client";
import { BenefitsTry } from "@/components";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import { Benefit, ClientMode } from "@/types/types";
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
    console.log(33, "benefits:", benefits);
    console.log(33, "currentUser:", currentUser);
    console.log(33, "clientMode:", clientMode);

    if (!benefits) return;

    if (id !== "0") {
      if (clientMode === "USER") {
        const userBenefits =
          benefits.filter((b) => currentUser?.clubs.includes(b.clubId)) || [];
        setBenefitsToShow(userBenefits);
        setCurrentTitle(titles[1]);
      } else if (clientMode === "SUPPLIER") {
        console.log("supplierId:", id);
        const supplierBenefits =
          benefits.filter((b) => b.supplierId === id) || [];
        setBenefitsToShow(supplierBenefits);
        setCurrentTitle(titles[2]);
      }
    } else {
      setBenefitsToShow(benefits); // Default: show all benefits
      setCurrentTitle(titles[0]);
      console.log(33, "benefitsAfter", benefits);
      console.log(33, "benefitToShow", benefitsToShow);
    }
  }, [benefits, currentUser, clientMode, id]);

  // Ensure general mode is set if in connection mode
  if (clientMode === ClientMode.connection) setClientMode(ClientMode.general);

  if (isLoadingB || isFetchingB) return <LoadingSpinner />;

  return <BenefitsTry benefits={benefitsToShow} title={currentTitle} />;
}
