"use client";
import React from "react";
import { FaMapMarkerAlt, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { Benefit, Branch, UpdateState } from "@/types/BenefitsTypes";
import { Supplier } from "@/types/SupplierTypes";

interface BenefitInfoLeftProps {
  updatedBenefit: Benefit | undefined;
  specificSupplier: Supplier | undefined;
  showBranches: boolean;
  isUpdateMode: boolean;
  dropdownVisible: boolean;
  handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, link: any) => void;
  setUpdateState: React.Dispatch<React.SetStateAction<UpdateState>>;
}

const BenefitInfoLeft: React.FC<BenefitInfoLeftProps> = ({
  updatedBenefit,
  specificSupplier,
  showBranches,
  isUpdateMode,
  dropdownVisible,
  handleLinkClick,
  setUpdateState,
}) => {
  const toggleBranches = () =>
    setUpdateState((prev) => ({ ...prev, showBranches: !prev.showBranches }));

  const toggleDropdown = () =>
    setUpdateState((prev) => ({
      ...prev,
      dropdownVisible: !prev.dropdownVisible,
    }));

  const handleAddBranch = (branch: Branch) => {
    if (updatedBenefit) {
      setUpdateState((prev) => ({
        ...prev,
        updatedBenefit: {
          ...prev.updatedBenefit,
          branches: [...(prev.updatedBenefit?.branches || []), branch],
        } as Benefit,
        selectedBranch: null,
        dropdownVisible: false,
      }));
    }
  };

  const handleRemoveBranch = (branchToRemove: Branch) => {
    if (updatedBenefit) {
      setUpdateState((prev) => ({
        ...prev,
        updatedBenefit: {
          ...prev.updatedBenefit,
          branches:
            prev.updatedBenefit?.branches?.filter(
              (branch) => branch !== branchToRemove
            ) || [],
        } as Benefit,
      }));
    }
  };

  const supplierBranches = specificSupplier ? specificSupplier.branches : [];
  const availableBranches = supplierBranches?.filter((branch) => {
    return !updatedBenefit?.branches.some(
      (existingBranch) =>
        existingBranch.nameBranch === branch.nameBranch &&
        existingBranch.city === branch.city
    );
  });

  const allBranchesSelected =
    supplierBranches &&
    supplierBranches.length > 0 &&
    updatedBenefit?.branches.length === supplierBranches.length;

  return (
    <div className={styles.leftColumn}>
      <div className={styles.logoContainer}>
        {specificSupplier && specificSupplier.supplierLogo ? (
          <img
            src={specificSupplier.supplierLogo}
            alt="Supplier Logo"
            className={styles.logo}
          />
        ) : (
          <div>אין לוגו זמין</div>
        )}
      </div>
      <div className={styles.branches}>
        <div className={styles.branchesScroll}>
          <div className={styles.branchLink}>
            <FaMapMarkerAlt className={styles.icon} />
            <span onClick={toggleBranches} className={styles.branchText}>
              רשימת הסניפים
            </span>
          </div>
          {showBranches && (
            <>
              {updatedBenefit?.branches &&
              updatedBenefit.branches.length > 0 ? (
                !isUpdateMode && allBranchesSelected ? (
                  <div className={styles.allBranchesText}>כל הסניפים</div>
                ) : (
                  <ul className={styles.branchList}>
                    {updatedBenefit?.branches?.map((branch, index) => (
                      <li key={index} className={styles.branchItem}>
                        <div
                          className={`${styles.branchInfo} ${
                            isUpdateMode ? styles.editing : ""
                          }`}
                        >
                          {isUpdateMode && (
                            <FaMinusCircle
                              className={styles.minIcon}
                              onClick={() => handleRemoveBranch(branch)}
                            />
                          )}
                          <div className={styles.branchLocation}>
                            <span className={styles.branchCity}>
                              {branch.city}
                            </span>
                            <span className={styles.branchAddress}>
                              {branch.nameBranch}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <div>אין סניפים</div>
              )}
              {isUpdateMode && (
                <div className={styles.addBranch}>
                  <FaPlusCircle
                    className={styles.plusIcon}
                    onClick={toggleDropdown}
                  />
                  {dropdownVisible && (
                    <div className={styles.dropdown}>
                      <select
                        onChange={(e) => {
                          const branch = JSON.parse(e.target.value);
                          handleAddBranch(branch);
                        }}
                      >
                        <option value="">
                          {availableBranches && availableBranches.length > 0
                            ? "בחר סניף"
                            : "כול הסניפים נבחרו"}
                        </option>
                        {availableBranches?.map((branch, index) => (
                          <option key={index} value={JSON.stringify(branch)}>
                            {branch.city}, {branch.nameBranch}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {specificSupplier && specificSupplier.siteLink ? (
        <a
          href={specificSupplier.siteLink}
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleLinkClick(e, specificSupplier.siteLink)}
        >
          מעבר לאתר העסק
        </a>
      ) : (
        <div>אין קישור לעסק</div>
      )}
    </div>
  );
};

export default BenefitInfoLeft;
