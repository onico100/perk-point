import React from 'react';
import { FaMapMarkerAlt, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { Benefit, Supplier, Branch } from "@/types/types";


interface BenefitInfoLeftProps {
    updatedBenefit: Benefit | undefined;
    specificSupplier: Supplier | undefined;
    showBranches: boolean;
    toggleBranches: () => void;
    isUpdateMode: boolean;
    availableBranches: Branch[] | undefined;
    handleAddBranch: (branch: Branch) => void;
    handleRemoveBranch: (branch: Branch) => void;
    dropdownVisible: boolean;
    toggleDropdown: () => void;
    handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, link: any) => void;
}

const BenefitInfoLeft: React.FC<BenefitInfoLeftProps> = ({
    updatedBenefit,
    specificSupplier,
    showBranches,
    toggleBranches,
    isUpdateMode,
    availableBranches,
    handleAddBranch,
    handleRemoveBranch,
    dropdownVisible,
    toggleDropdown,
    handleLinkClick,
}) => (
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
                    <span onClick={toggleBranches} className={styles.branchText}>רשימת הסניפים</span>
                </div>
                {showBranches && (
                    <>
                        {updatedBenefit?.branches && updatedBenefit.branches.length > 0 ? (
                            <ul className={styles.branchList}>
                                {updatedBenefit?.branches?.map((branch, index) => (
                                    <li key={index} className={styles.branchItem}>
                                        <div className={`${styles.branchInfo} ${isUpdateMode ? styles.editing : ""}`}>
                                            {isUpdateMode && (
                                                <FaMinusCircle className={styles.minIcon} onClick={() => handleRemoveBranch(branch)} />
                                            )}
                                            <div className={styles.branchLocation}>
                                                <span className={styles.branchCity}>{branch.city}</span>
                                                <span className={styles.branchAddress}>{branch.nameBranch}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div>אין סניפים</div>
                        )}
                        {isUpdateMode && (
                            <div className={styles.addBranch}>
                                <FaPlusCircle className={styles.plusIcon} onClick={toggleDropdown} />
                                {dropdownVisible && (
                                    <div className={styles.dropdown}>
                                        <select onChange={(e) => {
                                            const branch = JSON.parse(e.target.value);
                                            handleAddBranch(branch);
                                        }}>
                                            <option value="">{availableBranches && availableBranches.length > 0 ? "בחר סניף" : "כול הסניפים נבחרו"}</option>
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

export default BenefitInfoLeft;