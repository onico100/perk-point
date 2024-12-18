"use client";
import { BenefitsCard } from "@/components";
import SearchBenefits from "./SearchBenefits";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { Benefit, Club, Supplier } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Benefits/BenefitsGrid.module.css";
import useGeneralStore from "@/stores/generalStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { getVaildBenefits, getUnVAildBenefits } from "@/utils/benefitsUtils";
import Link from "next/link";

interface BenefitsContainerProps {
  benefits: Benefit[];
  title: string;
}

const BenefitsContainer = ({ benefits, title }: BenefitsContainerProps) => {
  const { suppliers } = useFetchSuppliers();
  const { clubs, categories } = useFetchGeneral();
  const { clientMode } = useGeneralStore();

  const [benefitsToShow, setBenefitsToShow] = useState<Benefit[]>([]);
  const [showValidBenefits, setShowValidBenefits] = useState(true);

  const params = useParams();
  const id = params.clientId;

  useEffect(() => {
    setBenefitsToShow(shuffleArray(getVaildBenefits(benefits)));
  }, [benefits]);

  const shuffleArray = (benefits: Benefit[]) => {
    return benefits.sort(() => Math.random() - 0.5);
  };

  const handleSearch = (
    supplierFilter: string,
    clubFilter: string[],
    categoryFilter: string[],
    branchFilter: string,
    expirationRange: [Date | null, Date | null]
  ) => {
    const [start, end] = expirationRange;

    const supplierMap = new Map(
      suppliers?.map((supplier) => [supplier._id, supplier])
    );

    const filteredBenefits = benefits?.filter((benefit) => {
      const supplier = supplierMap.get(benefit.supplierId);

      if (
        supplierFilter &&
        (!supplier || !supplier.businessName.includes(supplierFilter))
      ) {
        return false;
      }
      if (clubFilter.length > 0 && !clubFilter.includes(benefit.clubId)) {
        return false;
      }
      if (
        categoryFilter.length > 0 &&
        (!supplier ||
          !supplier.selectedCategories?.some((c) =>
            categoryFilter.includes(c.toString())
          ))
      ) {
        return false;
      }
      if (
        branchFilter &&
        (!supplier ||
          !supplier.branches?.some((b) => b.nameBranch?.includes(branchFilter)))
      ) {
        return false;
      }
      if ((start && new Date(benefit.expirationDate) < start) || (end && new Date(benefit.expirationDate) > end)) 
      {
        return false;
      }
      return true;
    });

    const dateFilteredBenefits = filteredBenefits?.filter((benefit) => {
      const isExpired = new Date(benefit.expirationDate) < new Date();
      return showValidBenefits ? !isExpired : isExpired;
    });
    setBenefitsToShow(dateFilteredBenefits || []);
  };

  const handleToggle = () => {
    setShowValidBenefits((prev) => !prev);
    const dateFilteredBenefits = showValidBenefits
      ? getUnVAildBenefits(benefits)
      : getVaildBenefits(benefits);
    setBenefitsToShow(dateFilteredBenefits || []);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <SearchBenefits
          clubs={clubs}
          categories={categories}
          onSearch={handleSearch}
        />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{title}</div>
          {(id != "0" || clientMode == "ADMIN") && (
            <div className={styles.toggleContainer}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={showValidBenefits}
                  onChange={handleToggle}
                  className={styles.hiddenCheckbox}
                />
                <span className={styles.toggleSwitch}></span>
                {showValidBenefits ? "הטבות בתוקף" : "הטבות לא בתוקף"}
              </label>
            </div>
          )}
        </div>
        <div className={styles.cardsContainer}>
          {benefitsToShow?.map((benefit) => (
            <BenefitsCard
              key={benefit._id}
              benefit={benefit}
              supplier={suppliers?.find(
                (s: Supplier) => s._id === benefit?.supplierId
              )}
              club={clubs?.find((c: Club) => c._id == benefit.clubId)}
            />
          ))}
          {id != "0" && clientMode == "SUPPLIER" && (
            <Link href="/addBenefit" className={styles.addButton}>
              <IoIosAddCircleOutline />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitsContainer;
