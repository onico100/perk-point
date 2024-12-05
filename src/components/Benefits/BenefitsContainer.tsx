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
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (id !== "0") {
      if (clientMode === "USER") {
        setBenefitsToShow(
          benefits?.filter((b: Benefit) =>
            currentUser?.clubs.includes(b.clubId)
          ) || []
        );
        setCurrentTitle(titles[1]);
      } else if (clientMode === "SUPPLIER") {
        console.log("supplierId: " + id)
        benefits?.forEach((element: any) => {
          console.log("b: " + element.supplierId)
        });
        setBenefitsToShow(
          benefits?.filter((b: Benefit) => b.supplierId == id) || []
        );
        setCurrentTitle(titles[2]);
      }
    } else {
      setBenefitsToShow(benefits || []);
    }
  }, [benefits]);

  const handleSearch = (supplierFilter: string, clubFilter: string[], categoryFilter: string[], branchFilter: string, expirationRange: [Date | null, Date | null]) => {
    const [start, end] = expirationRange;
    setBenefitsToShow(
      benefits?.filter((benefit) =>
        (supplierFilter ?
          suppliers?.find((s: Supplier) => s.businessName.includes(supplierFilter) && s._id === benefit.supplierId) : true) &&
        (clubFilter.length > 0 ?
          clubFilter.includes(benefit.clubId) : true) &&
        (categoryFilter.length > 0 ?
          suppliers?.find((s: Supplier) => s._id === benefit.supplierId && s.categories?.some((c) =>
            categoryFilter.includes(c.toString()))) : true) &&
        (branchFilter ?
          suppliers?.find((s: Supplier) =>
            s._id === benefit.supplierId &&
            s.branches?.some((b: Branch) =>
              b.nameBranch && b.nameBranch.includes(branchFilter))) : true) &&
        (end ? new Date(benefit.expirationDate) <= end : true)
      ) || []
    );
  };

  if (isLoadingB || isFetchingB) return <LoadingSpinner/>;

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <SearchBenefits clubs={clubs} categories={categories} onSearch={handleSearch} />
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
