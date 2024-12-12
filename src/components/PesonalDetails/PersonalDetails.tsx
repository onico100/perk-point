"use client";

import useGeneralStore from "@/stores/generalStore";
import {
  SupplierPersonalDetails,
  LoadingSpinner,
  UserPersonalDetails,
} from "@/components";

export default function PersonalDetails() {
  const { currentUser, currentSupplier } = useGeneralStore();

  if (!currentUser && !currentSupplier) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {currentUser && <UserPersonalDetails currentUser={currentUser} />}
      {currentSupplier && (
        <SupplierPersonalDetails currentSupplier={currentSupplier} />
      )}
    </>
  );
}
