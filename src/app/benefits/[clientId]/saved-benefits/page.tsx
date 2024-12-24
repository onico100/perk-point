"use client";
import { BenefitsContainer, LoadingSpinner } from "@/components";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import { Benefit } from "@/types/BenefitsTypes";
import { ClientMode } from "@/types/Generaltypes";

export default function savedBenefits() {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { currentUser, clientMode } = useGeneralStore();
  const title = "שמורים";

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
