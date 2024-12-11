"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { useEffect, useState } from "react";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { Benefit, Supplier, Club, ClientMode, Branch } from "@/types/types";
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { usePathname, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { confirmExternalNavigation, beforeActionAlert, confirmChangesAlert } from "@/utils/sweet-alerts";
import { FaArrowRight } from "react-icons/fa";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import BenefitInfoRight from "./BenefitInfoRight";
import BenefitInfoLeft from "./BenefitInfoLeft";
import ActionButtons from "./ActionButtons";

interface UpdateState {
  isUpdateMode: boolean;
  updatedBenefit: Benefit | undefined;
  showBranches: boolean;
  dropdownVisible: boolean;
  selectedBranch: Branch | null;
}

const BenefitDetails = () => {
  const router = useRouter();
  const { benefits, isLoadingB, isFetchingB, updateBenefit } = useFetchBenefits();
  const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
  const { clubs, isLoadingCategories, isFetchingCategories } = useFetchGeneral();
  const clientMode = useGeneralStore((state) => state.clientMode);
  const currentSupplier = useGeneralStore((state) => state.currentSupplier);

  const [updateState, setUpdateState] = useState<UpdateState>({
    isUpdateMode: false,
    updatedBenefit: undefined,
    showBranches: false,
    dropdownVisible: false,
    selectedBranch: null,
  });

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

  useEffect(() => {
    setUpdateState(prev => ({ ...prev, updatedBenefit: specificBenefit }));
  }, [specificBenefit]);

  const handleSave = async () => {
    const userConfirmed = await confirmChangesAlert();
    if (userConfirmed && updateState.updatedBenefit) {
      try {
        if (updateState.updatedBenefit._id) {
          await updateBenefit({
            id: updateState.updatedBenefit._id,
            updatedData: {
              description: updateState.updatedBenefit.description,
              redemptionConditions: updateState.updatedBenefit.redemptionConditions,
              expirationDate: updateState.updatedBenefit.expirationDate,
              branches: updateState.updatedBenefit.branches,
              isActive: updateState.updatedBenefit.isActive,
            },
          });
          console.log("הטבה עודכנה בהצלחה");
        }
      } catch (error) {
        console.error("Error updating benefit:", error);
      }
    }
    setUpdateState(prev => ({ ...prev, isUpdateMode: false }));
  };

  const handleCancel = async () => {
    const userConfirmed = await beforeActionAlert("האם אתה בטוח שברצונך לבטל את השינויים?", "ביטול");
    
    if (userConfirmed) {
      setUpdateState(prev => ({ ...prev, isUpdateMode: false }));
    }
  };

  const toggleBranches = () => setUpdateState(prev => ({ ...prev, showBranches: !prev.showBranches }));
  const toggleDropdown = () => setUpdateState(prev => ({ ...prev, dropdownVisible: !prev.dropdownVisible }));

  const handleAddBranch = (branch: Branch) => {
    if (updateState.updatedBenefit) {
      setUpdateState(prev => ({
        ...prev,
        updatedBenefit: {
          ...prev.updatedBenefit,
          branches: [...(prev.updatedBenefit?.branches || []), branch], // Initialize branches if undefined
        } as Benefit,
        selectedBranch: null,
        dropdownVisible: false,
      }));
    }
  };

  const handleRemoveBranch = (branchToRemove: Branch) => {
    if (updateState.updatedBenefit) {
      setUpdateState(prev => ({
        ...prev,
        updatedBenefit: {
          ...prev.updatedBenefit,
          branches: prev.updatedBenefit?.branches?.filter(branch => branch !== branchToRemove) || [], // Initialize branches if undefined
        } as Benefit,
      }));
    }
  };

  const handleChange = (field: keyof Benefit, value: string) => {
    if (updateState.updatedBenefit) {
      setUpdateState(prev => ({
        ...prev,
        updatedBenefit: {
          ...prev.updatedBenefit,
          [field]: field === "expirationDate" ? new Date(value) : value,
        } as Benefit,
      }));
    }
  };

  const handleLinkClick = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string) => {
    event.preventDefault();
    const userConfirmed = await confirmExternalNavigation(href);
    if (userConfirmed) {
      window.open(href, "_blank");
    }
  };

  if (isLoadingB || isFetchingB || isLoadingS || isFetchingS || isLoadingCategories || isFetchingCategories) {
    return <LoadingSpinner />;
  }

  const isCurrentSupplierBenefit = currentSupplier && specificSupplier && currentSupplier._id === specificSupplier._id;
  const supplierBranches = specificSupplier ? specificSupplier.branches : [];
  const availableBranches = supplierBranches?.filter(branch => {
    return !updateState.updatedBenefit?.branches.some(existingBranch => existingBranch.nameBranch === branch.nameBranch && existingBranch.city === branch.city);
  });


  const isExpired = updateState.updatedBenefit?.expirationDate && new Date(updateState.updatedBenefit.expirationDate) < new Date();
  const allBranchesSelected = supplierBranches && supplierBranches.length > 0 &&
    updateState.updatedBenefit?.branches.length === supplierBranches.length;


  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <FaArrowRight className={styles.backIcon} onClick={() => router.back()} />
        {isExpired && <span className={styles.expiredTitle}>פג תוקף</span>}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <BenefitInfoRight
            updatedBenefit={updateState.updatedBenefit}
            specificBenefit={specificBenefit}
            isUpdateMode={updateState.isUpdateMode}
            handleChange={handleChange}
            specificClub={specificClub}
            handleLinkClick={handleLinkClick}
          />
          <BenefitInfoLeft
            updatedBenefit={updateState.updatedBenefit}
            specificSupplier={specificSupplier}
            showBranches={updateState.showBranches}
            toggleBranches={toggleBranches}
            isUpdateMode={updateState.isUpdateMode}
            availableBranches={availableBranches}
            allBranchesSelected={allBranchesSelected}
            handleAddBranch={handleAddBranch}
            handleRemoveBranch={handleRemoveBranch}
            dropdownVisible={updateState.dropdownVisible}
            toggleDropdown={toggleDropdown}
            handleLinkClick={handleLinkClick}
          />
        </div>
        {
          isCurrentSupplierBenefit && clientMode === ClientMode.supplier &&(
            <ActionButtons
              isUpdateMode={updateState.isUpdateMode}
              setIsUpdateMode={() => setUpdateState(prev => ({ ...prev, isUpdateMode: true }))}
              handleSave={handleSave}
              handleCancel={handleCancel}
            />
          )
        }
      </div>
    </div>
  );
};

export default BenefitDetails;
