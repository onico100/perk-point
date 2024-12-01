"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import BenefitsCard from "./BenefitCard";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { Club, Supplier } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Benefits/BenefitsContainer.module.css";

const BenefitsContainer = () => {
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { suppliers } = useFetchSuppliers();
  const { clubs } = useFetchGeneral();

  if (isLoadingB || isFetchingB) return <div>Loading...</div>;
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>כל הההטבות</div>
      <div className={styles.cardsContainer}>
        {benefits?.map((benefit) => (
          <BenefitsCard
            key={benefit._id}
            benefit={benefit}
            supplier={suppliers?.find(
              (s: Supplier) => s._id === benefit?.supplierId
            )}
            club={clubs?.find((c: Club) => c._id == benefit.clubId)}
          ></BenefitsCard>
        ))}
      </div>
    </div>
  );
};

export default BenefitsContainer;
