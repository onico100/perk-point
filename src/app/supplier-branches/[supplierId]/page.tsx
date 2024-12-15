"use client";

import useGeneralStore from "@/stores/generalStore";
import {
  SupplierPersonalDetails,
  LoadingSpinner,
  UserPersonalDetails,
} from "@/components";
import SupplierBranches from "@/components/PesonalDetails/SupplierBranches";

export default function PersonalDetails() {
  const {currentSupplier } = useGeneralStore();

  if (!currentSupplier) {
    return <LoadingSpinner />;
  }

  return (
    <>
        <SupplierBranches currentSupplier={currentSupplier} />
    </>
  );
}
