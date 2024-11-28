"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { Benefit, Supplier, Club } from "@/types/types";

const BenefitDetails = () => {
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
  const { clubs, isLoadingC, isFetchingC } = useFetchGeneral();

  if (
    isLoadingB ||
    isFetchingB ||
    isLoadingS ||
    isFetchingS ||
    isLoadingC ||
    isFetchingC
  )
    return <div>Loading...</div>;

  const specificBenefitId = "673f0042d993d72c4c06490c";

  const specificBenefit: Benefit | undefined = benefits?.find(
    (benefit) => benefit._id === specificBenefitId
  );
  const specificSupplier: Supplier | undefined = suppliers?.find(
    (supplier) => supplier._id === specificBenefit?.supplierId
  );
  const specificClub: Club | undefined = clubs?.find(
    (club) => club._id === specificBenefit?.clubId
  );

  return (
    <div>
      <h1>Benefit Details</h1>
      <div>
        <strong>ID:</strong> {specificBenefit?._id}
        <br />
        <strong>Description:</strong> {specificBenefit?.description}
        <br />
        <strong>Supplier Logo:</strong> {specificSupplier?.supplierLogo}
        <br />
        <strong>Club link:</strong> {specificClub?.clubLink}
        <br />
      </div>
    </div>
  );
};

export default BenefitDetails;
