"use client";
import { BenefitsContainer } from "@/components";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import { Benefit, ClientMode, PreMode } from "@/types/types";
import { useParams } from "next/navigation";

export default function savedBenefits() {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { currentUser, clientMode } = useGeneralStore();
  const title = "שמורים";
  const params = useParams();
  const id = params.clientId;

  if (clientMode == ClientMode.connection) setClientMode(ClientMode.general);

  let benefitsToShow: Benefit[] = [];

  if (benefits) {
    benefitsToShow = benefits.filter((b: Benefit) =>
      currentUser?.savedBenefits.includes(b._id || "-1")
    );
  }

  if (isLoadingB || isFetchingB) return <LoadingSpinner />;

  return <BenefitsContainer benefits={benefitsToShow} title={title} />;
}
