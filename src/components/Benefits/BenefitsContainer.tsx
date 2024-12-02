"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import BenefitsCard from "@/components/Benefits/BenefitCard";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { Benefit, Club, Supplier } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Benefits/BenefitsContainer.module.css";
import useGeneralStore from "@/stores/generalStore";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const BenefitsContainer = () => {
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { suppliers } = useFetchSuppliers();
  const { clubs } = useFetchGeneral();
  const { currentUser, clientMode } = useGeneralStore();

  const [benefitsToShow, setBenefitsToShow] = useState<Benefit[]>([]);
 
  const params = useParams();
  const id = params.clientId;

  useEffect(() => {
    if (id !== "0") {
      if (clientMode === "USER") {
        setBenefitsToShow(
          benefits?.filter((b: Benefit) => currentUser?.clubs.includes(b.clubId)) || []
        );
      } else if (clientMode === "SUPPLIER") {
        setBenefitsToShow(
          benefits?.filter((b: Benefit) => b.supplierId == id) || []
        );
      }
    } else {
      setBenefitsToShow(benefits || []);
    }
    console.log(benefits)
    console.log(benefitsToShow)
    console.log(id)
  }, [benefits]);

  if (isLoadingB || isFetchingB) return <div>Loading...</div>;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>כל הההטבות</div>
      <div className={styles.cardsContainer}>
        {benefitsToShow.map((benefit) => (
          <BenefitsCard
            key={benefit._id}
            benefit={benefit}
            supplier={suppliers?.find(
              (s: Supplier) => s._id === benefit?.supplierId
            )}
            club={clubs?.find((c: Club) => c._id == benefit.clubId)}
          />
        ))}
      </div>
    </div>
  );
};

export default BenefitsContainer;
