"use client";
import { BenefitsCard } from "@/components";
import SearchBenefits from "./SearchBenefits";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Benefits/BenefitsGrid.module.css";
import useGeneralStore from "@/stores/generalStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  getVaildBenefits,
  getUnVAildBenefits,
  sortBenefitsByCounter,
} from "@/utils/benefitsUtils";
import Link from "next/link";
import useFilterStore from "@/stores/filterStore";
import { Benefit } from "@/types/BenefitsTypes";
import { Supplier } from "@/types/SupplierTypes";
import { Club } from "@/types/ClubTypes";
import { FaFileExcel } from "react-icons/fa";

interface BenefitsContainerProps {
  benefits: Benefit[];
  title: string;
}

const BenefitsContainer = ({ benefits, title }: BenefitsContainerProps) => {
  const { suppliers } = useFetchSuppliers();
  const { clubs, categories } = useFetchGeneral();
  const { clientMode } = useGeneralStore();
  const {
    isBenefitDetailPage,
    setBenefitDetailPage,
    resetFiltersMain,
    resetFiltersPersenal,
  } = useFilterStore();

  const [benefitsToShow, setBenefitsToShow] = useState<Benefit[]>([]);
  const [showValidBenefits, setShowValidBenefits] = useState(true);

  const params = useParams();
  const id = params.clientId;

  const router = useRouter();

  useEffect(() => {
    if (benefits.length > 0) {
      showValidBenefits
        ? setBenefitsToShow(getVaildBenefits(benefits))
        : setBenefitsToShow(getUnVAildBenefits(benefits));
    }
  }, [benefits]);

  useEffect(() => {
    if (!isBenefitDetailPage) {
      resetFiltersMain();
      resetFiltersPersenal();
    } else {
      setBenefitDetailPage(false);
    }
  }, [isBenefitDetailPage]);

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
          !supplier.selectedCategories?.some((c: any) =>
            categoryFilter.includes(c.toString())
          ))
      ) {
        return false;
      }
      if (
        branchFilter &&
        (!supplier ||
          !supplier.branches?.some((b: any) =>
            b.nameBranch?.includes(branchFilter)
          ))
      ) {
        return false;
      }
      if (
        (start && new Date(benefit.expirationDate) < start) ||
        (end && new Date(benefit.expirationDate) > end)
      ) {
        return false;
      }
      return true;
    });

    const dateFilteredBenefits = filteredBenefits?.filter((benefit) => {
      const isExpired = getVaildBenefits([benefit]).length == 0;
      return showValidBenefits ? !isExpired : isExpired;
    });
    setBenefitsToShow(dateFilteredBenefits || []);
  };

  const handleToggle = () => {
    setShowValidBenefits((prev) => !prev);
    const dateFilteredBenefits = showValidBenefits
      ? sortBenefitsByCounter(getUnVAildBenefits(benefits))
      : sortBenefitsByCounter(getVaildBenefits(benefits));
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
          {id != "0" && clientMode == "SUPPLIER" && (
            <div className={styles.buttonsAddingContainer}>
              <Link href="/addBenefit" className={styles.addButton}>
                <IoIosAddCircleOutline />
              </Link>
              <button
                className={styles.excelButton}
                onClick={() => router.push(`/xlsx/`)}
              >
                <FaFileExcel className={styles.excelIcon} /> להעלת קובץ אקסל
              </button>
            </div>
          )}
          {benefitsToShow.length === 0 ? (
            <div className={styles.noBenefitsMessage}>
              <div>לא נמצאו הטבות.</div>
              {id !== "0" && clientMode === "USER" && showValidBenefits && (
                <>
                  <Link href="/clubs/0" className={styles.link}>
                    להוספת מועדון
                  </Link>
                </>
              )}
            </div>
          ) : (
            benefitsToShow?.map((benefit) => (
              <BenefitsCard
                key={benefit._id}
                benefit={benefit}
                supplier={suppliers?.find(
                  (s: Supplier) => s._id === benefit?.supplierId
                )}
                club={clubs?.find((c: Club) => c._id == benefit.clubId)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitsContainer;
