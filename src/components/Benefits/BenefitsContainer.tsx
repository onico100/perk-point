"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import BenefitsCard from "@/components/Benefits/BenefitCard";
import SearchBenefits from "./SearchBenefits";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { Benefit, Club, Supplier, Branch } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "@/styles/Benefits/BenefitsContainer.module.css";
import useGeneralStore from "@/stores/generalStore";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const BenefitsContainer = () => {
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
  const { suppliers } = useFetchSuppliers();
  const { clubs, categories } = useFetchGeneral();
  const { currentUser, clientMode } = useGeneralStore();
  const titles = ["כל ההטבות", "ההטבות שלי", "הטבות החברה"];
  const [currentTitle, setCurrentTitle] = useState(titles[0]);
  const [benefitsToShow, setBenefitsToShow] = useState<Benefit[]>([]);
  // const [branchFilter, setBranchFilter] = useState(""); // **State for branchFilter**
  const params = useParams();
  const id = params.clientId;
  const pathName = usePathname();

  useEffect(() => {
    console.log("Fetched benefits:", benefits);
    if (id !== "0") {
      if (clientMode === "USER") {
        if (pathName.includes("/saved-benefits")) {
          setBenefitsToShow(
            benefits?.filter((b: Benefit) =>
              currentUser?.savedBenefits.includes(b._id || "-1")
            ) || []
          );
        } else {
          setBenefitsToShow(
            benefits?.filter((b: Benefit) =>
              currentUser?.clubs.includes(b.clubId)
            ) || []
          );
          setCurrentTitle(titles[1]);
        }
      } else if (clientMode === "SUPPLIER") {
        console.log("supplierId: " + id);
        benefits?.forEach((element: any) => {
          console.log("b: " + element.supplierId);
        });
        setBenefitsToShow(
          benefits?.filter((b: Benefit) => b.supplierId == id) || []
        );
        setCurrentTitle(titles[2]);
      }
    } else {
      setBenefitsToShow(benefits || []);
    }
  }, [benefits, currentUser]);


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
      if (end && new Date(benefit.expirationDate) > end) {
        return false;
      }
      return true;
    });
    console.log(filteredBenefits, "filteredBenefits", supplierFilter);
    setBenefitsToShow(filteredBenefits || []);
  };

  if (isLoadingB || isFetchingB) return <LoadingSpinner />;

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
        <div className={styles.title}>{currentTitle}</div>
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
