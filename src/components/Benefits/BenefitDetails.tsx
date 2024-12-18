"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Benefit, Supplier, Club, ClientMode } from "@/types/types";
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import {
  confirmExternalNavigation,
  beforeActionAlert,
  confirmChangesAlert,
} from "@/utils/sweet-alerts";
import { FaArrowRight } from "react-icons/fa";
import {
  BenefitInfoRight,
  BenefitInfoLeft,
  ActionButtons,
} from "@/components";
import { UpdateState } from "@/types/benefits/types"



interface BenefitsDetailsProps {
  specificBenefit?: Benefit;
  specificSupplier?: Supplier;
  specificClub?: Club;
}

const BenefitsDetails: React.FC<BenefitsDetailsProps> = ({ specificBenefit, specificSupplier, specificClub }) => {

  const router = useRouter();

  const { updateBenefit } = useFetchBenefits();

  const clientMode = useGeneralStore((state) => state.clientMode);
  const currentSupplier = useGeneralStore((state) => state.currentSupplier);


  const [updateState, setUpdateState] = useState<UpdateState>({
    isUpdateMode: false,
    updatedBenefit: specificBenefit || undefined,
    showBranches: false,
    dropdownVisible: false,
    selectedBranch: null,
  });

  const handleSave = async () => {
    const userConfirmed = await confirmChangesAlert();
    if (userConfirmed && updateState.updatedBenefit) {
      try {
        if (updateState.updatedBenefit._id) {
          await updateBenefit({
            id: updateState.updatedBenefit._id,
            updatedData: {
              description: updateState.updatedBenefit.description,
              redemptionConditions:
                updateState.updatedBenefit.redemptionConditions,
              expirationDate: updateState.updatedBenefit.expirationDate,
              branches: updateState.updatedBenefit.branches,
              isActive: updateState.updatedBenefit.isActive,
            },
          });
        }
      } catch (error) {
        console.error("Error updating benefit:", error);
      }
    }
    setUpdateState((prev) => ({ ...prev, isUpdateMode: false, selectedBranch: null, }));

  };

  const handleCancel = async () => {
    const userConfirmed = await beforeActionAlert(
      "האם אתה בטוח שברצונך לבטל את השינויים?"
    );

    if (userConfirmed) {
      setUpdateState((prev) => ({
        ...prev, 
        isUpdateMode: false, 
        updatedBenefit: {
          ...prev.updatedBenefit,
          branches: specificBenefit ? specificBenefit.branches : [],
        }as Benefit, 
        selectedBranch: null,
      }));
    }
  };

  const handleLinkClick = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    event.preventDefault();
    const userConfirmed = await confirmExternalNavigation(href);
    if (userConfirmed) {
      window.open(href, "_blank");
    }
  };

  const isCurrentSupplierBenefit =
    currentSupplier &&
    specificSupplier &&
    currentSupplier._id === specificSupplier._id;


  const isExpired = updateState.updatedBenefit?.expirationDate &&
    new Date(updateState.updatedBenefit.expirationDate) < new Date();


  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <FaArrowRight
          className={styles.backIcon}
          onClick={() => router.back()}
        />
        {isExpired && <span className={styles.expiredTitle}>פג תוקף</span>}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <BenefitInfoRight
            updatedBenefit={updateState.updatedBenefit}
            specificBenefit={specificBenefit}
            isUpdateMode={updateState.isUpdateMode}
            specificClub={specificClub}
            handleLinkClick={handleLinkClick}
            setUpdateState={setUpdateState}
          />
          <BenefitInfoLeft
            updatedBenefit={updateState.updatedBenefit}
            specificSupplier={specificSupplier}
            showBranches={updateState.showBranches}
            isUpdateMode={updateState.isUpdateMode}
            dropdownVisible={updateState.dropdownVisible}
            handleLinkClick={handleLinkClick}
            setUpdateState={setUpdateState}
          />
        </div>
        {(clientMode == "ADMIN" ||
          (isCurrentSupplierBenefit && clientMode === ClientMode.supplier)) && (
            <ActionButtons
              isUpdateMode={updateState.isUpdateMode}
              setIsUpdateMode={() =>
                setUpdateState((prev) => ({ ...prev, isUpdateMode: true }))
              }
              handleSave={handleSave}
              handleCancel={handleCancel}
            />
          )}
      </div>
    </div>
  );
};

export default BenefitsDetails;
