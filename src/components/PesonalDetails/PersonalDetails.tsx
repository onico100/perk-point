"use client";

import useGeneralStore from "@/stores/generalStore";
import SupplierPersonalDetails from "./SupplierPersonalDetails";
import UserPersonalDetails from "./UserPersonalDetails";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

export default function PersonalDetails() {
  const { currentUser, currentSupplier } = useGeneralStore();

  if (!currentUser && !currentSupplier) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {currentUser && <UserPersonalDetails currentUser={currentUser}></UserPersonalDetails>}
      {currentSupplier && <SupplierPersonalDetails currentSupplier={currentSupplier}></SupplierPersonalDetails>}
    </>
  );
}
