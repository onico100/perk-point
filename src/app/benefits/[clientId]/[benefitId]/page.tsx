"use client";
import { BenefitsDetails } from "@/components";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { LoadingSpinner } from "@/components";
import { usePathname } from "next/navigation";

import useFilterStore from "@/stores/filterStore";
import { Benefit } from "@/types/BenefitsTypes";
import { Supplier } from "@/types/SupplierTypes";
import { Club } from "@/types/ClubTypes";

export default function BenefitId() {
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
  const { clubs, isLoadingCategories, isFetchingCategories } =
    useFetchGeneral();
  const setBenefitDetailPage = useFilterStore(
    (state) => state.setBenefitDetailPage
  );
  setBenefitDetailPage(true);

  const pathname = usePathname();
  const specificBenefitId = pathname.split("/")[3];

  const specificBenefit: Benefit | undefined = benefits?.find(
    (benefit) => benefit._id === specificBenefitId
  );
  const specificSupplier: Supplier | undefined = suppliers?.find(
    (supplier) => supplier._id === specificBenefit?.supplierId
  );
  const specificClub = clubs?.find(
    (club: Club) => club._id === specificBenefit?.clubId
  );

  if (
    isLoadingB ||
    isFetchingB ||
    isLoadingS ||
    isFetchingS ||
    isLoadingCategories ||
    isFetchingCategories
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <BenefitsDetails
        specificBenefit={specificBenefit}
        specificSupplier={specificSupplier}
        specificClub={specificClub}
      />
    </div>
  );
}
