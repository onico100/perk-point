"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import BenefitsCard from "@/components/Benefits/BenefitCard";
import SearchBenefits from "./SearchBenefits";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { Benefit, Club, Supplier, Branch } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Benefits/BenefitsContainer.module.css";
import useGeneralStore from "@/stores/generalStore";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Link from "next/link";

interface BenefitsContainerProps {
  benefits: Benefit[];
  title: string;
}

const BenefitsContainer = ({ benefits, title }: BenefitsContainerProps) => {
  const { suppliers } = useFetchSuppliers();
  const { clubs, categories } = useFetchGeneral();
  const { clientMode } = useGeneralStore();

  const [benefitsToShow, setBenefitsToShow] = useState<Benefit[]>(benefits);

  // const [branchFilter, setBranchFilter] = useState(""); // **State for branchFilter**
  const params = useParams();
  const id = params.clientId;

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

    const filteredBenefits = benefitsToShow?.filter((benefit) => {
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
      if (end && new Date(benefit.expirationDate) > end) {
        return false;
      }
      return true;
    });
    console.log(filteredBenefits, "filteredBenefits", supplierFilter);
    setBenefitsToShow(filteredBenefits || []);
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
        <div className={styles.title}>{title}</div>
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
