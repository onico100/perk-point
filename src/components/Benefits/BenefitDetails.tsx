"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { useEffect, useState } from "react";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { Benefit, Supplier, Club, ClientMode, Branch } from "@/types/types";
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { usePathname, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { confirmExternalNavigation, beforeActionAlert, confirmChangesAlert } from "@/utils/sweet-alerts";
import { FaArrowRight } from "react-icons/fa";
import BenefitInfoRight from "./BenefitInfoRight";
import BenefitInfoLeft from "./BenefitInfoLeft";
import ActionButtons from "./ActionButtons";

interface UpdateState {
  isUpdateMode: boolean;
  updatedBenefit: Benefit | undefined;
  showBranches: boolean;
  dropdownVisible: boolean;
  selectedBranch: Branch | null;
}

const BenefitDetails = () => {
  const router = useRouter();
  const { benefits, isLoadingB, isFetchingB, updateBenefit } = useFetchBenefits();
  const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
  const { clubs, isLoadingCategories, isFetchingCategories } = useFetchGeneral();
  const clientMode = useGeneralStore((state) => state.clientMode);
  const currentSupplier = useGeneralStore((state) => state.currentSupplier);

  const [updateState, setUpdateState] = useState<UpdateState>({
    isUpdateMode: false,
    updatedBenefit: undefined,
    showBranches: false,
    dropdownVisible: false,
    selectedBranch: null,
  });

  const pathname = usePathname();
  const specificBenefitId = pathname.split("/")[3];

  const specificBenefit: Benefit | undefined = benefits?.find(
    (benefit) => benefit._id === specificBenefitId
  );
  const specificSupplier: Supplier | undefined = suppliers?.find(
    (supplier) => supplier._id === specificBenefit?.supplierId
  );
  const specificClub = clubs?.find(
    (club: Club) => club._id === specificBenefit?.clubId
  );

  useEffect(() => {
    setUpdateState(prev => ({ ...prev, updatedBenefit: specificBenefit }));
  }, [specificBenefit]);

  const handleSave = async () => {
    const userConfirmed = await confirmChangesAlert();
    if (userConfirmed && updateState.updatedBenefit) {
      try {
        if (updateState.updatedBenefit._id) {
          await updateBenefit({
            id: updateState.updatedBenefit._id,
            updatedData: {
              description: updateState.updatedBenefit.description,
              redemptionConditions: updateState.updatedBenefit.redemptionConditions,
              expirationDate: updateState.updatedBenefit.expirationDate,
              branches: updateState.updatedBenefit.branches,
              isActive: updateState.updatedBenefit.isActive,
            },
          });
          console.log("הטבה עודכנה בהצלחה");
        }
      } catch (error) {
        console.error("Error updating benefit:", error);
      }
    }
    setUpdateState(prev => ({ ...prev, isUpdateMode: false }));
  };

  const handleCancel = async () => {
    const userConfirmed = await beforeActionAlert("האם אתה בטוח שברצונך לבטל את השינויים?", "ביטול");
    
    if (userConfirmed) {
      setUpdateState(prev => ({ ...prev, isUpdateMode: false }));
    }
  };

  const toggleBranches = () => setUpdateState(prev => ({ ...prev, showBranches: !prev.showBranches }));
  const toggleDropdown = () => setUpdateState(prev => ({ ...prev, dropdownVisible: !prev.dropdownVisible }));

  const handleAddBranch = (branch: Branch) => {
    if (updateState.updatedBenefit) {
      setUpdateState(prev => ({
        ...prev,
        updatedBenefit: {
          ...prev.updatedBenefit,
          branches: [...(prev.updatedBenefit?.branches || []), branch], // Initialize branches if undefined
        } as Benefit,
        selectedBranch: null,
        dropdownVisible: false,
      }));
    }
  };

  const handleRemoveBranch = (branchToRemove: Branch) => {
    if (updateState.updatedBenefit) {
      setUpdateState(prev => ({
        ...prev,
        updatedBenefit: {
          ...prev.updatedBenefit,
          branches: prev.updatedBenefit?.branches?.filter(branch => branch !== branchToRemove) || [], // Initialize branches if undefined
        } as Benefit,
      }));
    }
  };

  const handleChange = (field: keyof Benefit, value: string) => {
    if (updateState.updatedBenefit) {
      setUpdateState(prev => ({
        ...prev,
        updatedBenefit: {
          ...prev.updatedBenefit,
          [field]: field === "expirationDate" ? new Date(value) : value,
        } as Benefit,
      }));
    }
  };

  const handleLinkClick = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string) => {
    event.preventDefault();
    const userConfirmed = await confirmExternalNavigation(href);
    if (userConfirmed) {
      window.open(href, "_blank");
    }
  };

  if (isLoadingB || isFetchingB || isLoadingS || isFetchingS || isLoadingCategories || isFetchingCategories) {
    return <div>Loading...</div>;
  }

  const isCurrentSupplierBenefit = currentSupplier && specificSupplier && currentSupplier._id === specificSupplier._id;
  const supplierBranches = specificSupplier ? specificSupplier.branches : [];
  const availableBranches = supplierBranches?.filter(branch => {
    return !updateState.updatedBenefit?.branches.some(existingBranch => existingBranch.nameBranch === branch.nameBranch && existingBranch.city === branch.city);
  });


  const isExpired = updateState.updatedBenefit?.expirationDate && new Date(updateState.updatedBenefit.expirationDate) < new Date();



  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <FaArrowRight className={styles.backIcon} onClick={() => router.back()} />
        {isExpired && <span className={styles.expiredTitle}>פג תוקף</span>}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <BenefitInfoRight
            updatedBenefit={updateState.updatedBenefit}
            specificBenefit={specificBenefit}
            isUpdateMode={updateState.isUpdateMode}
            handleChange={handleChange}
            specificClub={specificClub}
            handleLinkClick={handleLinkClick}
          />
          <BenefitInfoLeft
            updatedBenefit={updateState.updatedBenefit}
            specificSupplier={specificSupplier}
            showBranches={updateState.showBranches}
            toggleBranches={toggleBranches}
            isUpdateMode={updateState.isUpdateMode}
            availableBranches={availableBranches}
            handleAddBranch={handleAddBranch}
            handleRemoveBranch={handleRemoveBranch}
            dropdownVisible={updateState.dropdownVisible}
            toggleDropdown={toggleDropdown}
            handleLinkClick={handleLinkClick}
          />
        </div>
        {
          isCurrentSupplierBenefit && clientMode === ClientMode.supplier &&(
            <ActionButtons
              isUpdateMode={updateState.isUpdateMode}
              setIsUpdateMode={() => setUpdateState(prev => ({ ...prev, isUpdateMode: true }))}
              handleSave={handleSave}
              handleCancel={handleCancel}
            />
          )
        }
      </div>
    </div>
  );
};

export default BenefitDetails;





// "use client";
// import { useFetchBenefits } from "@/hooks/useFetchBenefits";
// import { useEffect, useState } from "react";
// import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
// import { useFetchGeneral } from "@/hooks/useFetchGeneral";
// import { Benefit, Supplier, Club, ClientMode, Branch } from "@/types/types";
// import styles from "@/styles/Benefits/BenefitDetais.module.css";
// import { usePathname, useRouter } from "next/navigation";
// import useGeneralStore from "@/stores/generalStore";
// import { confirmExternalNavigation, beforeActionAlert, confirmChangesAlert } from "@/utils/sweet-alerts";
// import { FaPlusCircle, FaMinusCircle, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

// const BenefitDetails = () => {
//   const router = useRouter();
//   const { benefits, isLoadingB, isFetchingB, updateBenefit } = useFetchBenefits();
//   const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
//   const { clubs, isLoadingCategories, isFetchingCategories } = useFetchGeneral();
//   const clientMode = useGeneralStore((state) => state.clientMode);
//   const currentSupplier = useGeneralStore((state) => state.currentSupplier);

//   const [isUpdateMode, setIsUpdateMode] = useState(false);
//   const [updatedBenefit, setUpdatedBenefit] = useState<Benefit | undefined>(
//     undefined
//   );
//   const [showBranches, setShowBranches] = useState(false);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [selectedBranch, setSelectedBranch] = useState(null);

//   const pathname = usePathname();
//   const specificBenefitId = pathname.split("/")[3];

// const specificBenefit: Benefit | undefined = benefits?.find(
//   (benefit) => benefit._id === specificBenefitId
// );
// const specificSupplier: Supplier | undefined = suppliers?.find(
//   (supplier) => supplier._id === specificBenefit?.supplierId
// );
// const specificClub = clubs?.find(
//   (club: Club) => club._id === specificBenefit?.clubId
// );

//   useEffect(() => {
//     if (isUpdateMode) {
//       setUpdatedBenefit(specificBenefit);
//     } else {
//       setUpdatedBenefit(specificBenefit);
//     }
//   }, [isUpdateMode, specificBenefit]);

// const handleSave = async () => {
//   const userConfirmed = await confirmChangesAlert();

//   if (userConfirmed) {

//     if (updatedBenefit) {
//       try {
//         if (updatedBenefit._id) {
//           await updateBenefit({
//             id: updatedBenefit._id,
//             updatedData: {
//               description: updatedBenefit.description,
//               redemptionConditions: updatedBenefit.redemptionConditions,
//               expirationDate: updatedBenefit.expirationDate,
//               branches: updatedBenefit.branches,
//               isActive: updatedBenefit.isActive,
//             },
//           });
//           console.log("הטבה עודכנה בהצלחה");
//         }
//       } catch (error) {
//         console.error("Error updating benefit:", error);
//       }
//     }
//   }
//   setIsUpdateMode(false);
// };

//   const handleCancel = async () => {
//     const userConfirmed = await beforeActionAlert("האם אתה בטוח שברצונך לבטל את השינויים?", "ביטול");

//     if (userConfirmed) {
//       setIsUpdateMode(false);
//     }
//   };

//   const toggleBranches = () => setShowBranches((prev) => !prev);

//   const toggleDropdown = () => {
//     setDropdownVisible((prev) => !prev);
//   };

// const handleAddBranch = (branch: Branch) => {
//   if (updatedBenefit) {
//     setUpdatedBenefit({
//       ...updatedBenefit,
//       branches: [...updatedBenefit.branches, branch],
//     });
//     setSelectedBranch(null);
//     setDropdownVisible(false);
//   }
// };

//   const handleLinkClick = async (
//     event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
//     href: string) => {
//     event.preventDefault();
//     const userConfirmed = await confirmExternalNavigation(href);
//     if (userConfirmed) {
//       window.open(href, "_blank");
//     }
//   };

//   const handleRemoveBranch = (branchToRemove: Branch) => {
//     if (updatedBenefit) {
//       setUpdatedBenefit({
//         ...updatedBenefit,
//         branches: updatedBenefit.branches.filter(
//           (branch) => branch !== branchToRemove
//         ),
//       });
//     }
//   };

//   const handleChange = (field: keyof Benefit, value: string) => {
//     if (updatedBenefit) {
//       setUpdatedBenefit({
//         ...updatedBenefit,
//         [field]: field === "expirationDate" ? new Date(value) : value,
//       });
//     }
//   };

//   if (
//     isLoadingB ||
//     isFetchingB ||
//     isLoadingS ||
//     isFetchingS ||
//     isLoadingCategories ||
//     isFetchingCategories
//   )
//     return <div>Loading...</div>;

//   const isCurrentSupplierBenefit =
//     currentSupplier &&
//     specificSupplier &&
//     currentSupplier._id === specificSupplier._id;

//   const supplierBranches = specificSupplier ? specificSupplier.branches : [];

//   const availableBranches = supplierBranches?.filter((branch) => {
//     return !updatedBenefit?.branches.some(
//       (existingBranch) => existingBranch.nameBranch === branch.nameBranch && existingBranch.city === branch.city
//     );
//   });

//   const allBranchesSelected = supplierBranches && supplierBranches.length > 0 &&
//     updatedBenefit?.branches.length === supplierBranches.length;

//   const isExpired = updatedBenefit?.expirationDate && new Date(updatedBenefit.expirationDate) < new Date();

//   return (
//     <div className={styles.container}>
//       <div className={styles.topContainer}>
//         <FaArrowRight
//           className={styles.backIcon}
//           onClick={() => router.back()}
//         />
//         {isExpired && <span className={styles.expiredTitle}>פג תוקף</span>}
//       </div>

//       <div className={styles.contentContainer}>
//         <div className={styles.content}>
//           <div className={styles.rightColumn}>
//             <div className={styles.infoContainer}>
//               <label htmlFor="description" className={styles.infoLabel}>
//                 תיאור ההטבה:
//               </label>
//               <textarea
//                 id="description"
//                 className={styles.infoBox}
//                 value={updatedBenefit?.description || ""}
//                 readOnly={!isUpdateMode}
//                 onChange={(e) => handleChange("description", e.target.value)
//                 }
//               />
//             </div>
//             {specificClub && specificClub.clubLink ? (
//               <a
//                 href={specificClub.clubLink}
//                 className={styles.button}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => handleLinkClick(e, specificClub.clubLink)}
//               >
//                 מעבר להטבה: {specificClub ? specificClub.clubName : ""}
//               </a>
//             ) : (
//               <div>אין קישור למועדון</div>
//             )}
//             <div className={styles.infoContainer}>
//               <label htmlFor="conditions" className={styles.infoLabel}>
//                 הגבלות:
//               </label>
//               <textarea
//                 id="conditions"
//                 className={styles.infoBox}
//                 value={updatedBenefit?.redemptionConditions || ""}
//                 readOnly={!isUpdateMode}
//                 onChange={(e) => handleChange("redemptionConditions", e.target.value)}
//               />
//               <label htmlFor="expirationDate" className={styles.infoLabel}>
//                 תוקף:
//               </label>
//               {isUpdateMode ? (
//                 <input
//                   type="date"
//                   className={styles.infoBox}
//                   value={
//                     updatedBenefit?.expirationDate
//                       ? new Date(updatedBenefit.expirationDate)
//                         .toISOString()
//                         .split("T")[0]
//                       : " "
//                   }
//                   onChange={(e) => handleChange("expirationDate", e.target.value)}
//                 />
//               ) : specificBenefit?.expirationDate ? (
//                 new Date(specificBenefit.expirationDate).toLocaleDateString(
//                   "he-IL",
//                   {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   }
//                 )
//               ) : (
//                 "Not Available"
//               )}
//             </div>
//           </div>
//           <div className={styles.leftColumn}>
//             <div className={styles.logoContainer}>
//               {specificSupplier && specificSupplier.supplierLogo ? (
//                 <img
//                   src={specificSupplier.supplierLogo}
//                   alt="Supplier Logo"
//                   className={styles.logo}
//                 />
//               ) : (
//                 <div>אין לוגו זמין</div>
//               )}
//             </div>
//             <div className={styles.branches}>
//               <div className={styles.branchesScroll}>
//                 <div className={styles.branchLink}>
//                   <FaMapMarkerAlt className={styles.icon} />
//                   <span onClick={toggleBranches} className={styles.branchText}>
//                     רשימת הסניפים
//                   </span>
//                 </div>
//                 {showBranches && (
//                   <>
//                     {updatedBenefit?.branches && updatedBenefit.branches.length > 0 ? (
//                       !isUpdateMode && allBranchesSelected ? (
//                         <div className={styles.allBranchesText}>כל הסניפים</div>
//                       ) : (
//                         <ul className={styles.branchList}>
//                           {updatedBenefit.branches.map((branch, index) => (
//                             <li key={index} className={styles.branchItem}>
//                               <div
//                                 className={`${styles.branchInfo} ${isUpdateMode ? styles.editing : ""
//                                   }`}
//                               >
//                                 {isUpdateMode && (
//                                   <FaMinusCircle
//                                     className={styles.minIcon}
//                                     onClick={() => handleRemoveBranch(branch)}
//                                   />
//                                 )}
//                                 <div className={styles.branchLocation}>
//                                   <span className={styles.branchCity}>{branch.city}</span>
//                                   <span className={styles.branchAddress}>
//                                     {branch.nameBranch}
//                                   </span>
//                                 </div>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>
//                       )
//                     ) : (
//                       <div>אין סניפים</div>
//                     )}
//                     {isUpdateMode && (
//                       <div className={styles.addBranch}>
//                         <FaPlusCircle className={styles.plusIcon} onClick={toggleDropdown} />
//                         {dropdownVisible && (
//                           <div className={styles.dropdown}>
//                             <select
//                               onChange={(e) => {
//                                 const branch = JSON.parse(e.target.value);
//                                 setSelectedBranch(branch);
//                                 handleAddBranch(branch);
//                               }}
//                             >
//                               <option value="">
//                                 {availableBranches && availableBranches.length > 0 ? "בחר סניף" : "כול הסניפים נבחרו"}
//                               </option>
//                               {availableBranches?.map((branch, index) => (
//                                 <option key={index} value={JSON.stringify(branch)}>
//                                   {branch.city}, {branch.nameBranch}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//             {specificSupplier && specificSupplier.siteLink ? (
//               <a
//                 href={specificSupplier.siteLink}
//                 className={styles.button}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => handleLinkClick(e, specificClub.clubLink)}
//               >
//                 מעבר לאתר העסק
//               </a>
//             ) : (
//               <div>אין קישור לעסק</div>
//             )}
//           </div>
//         </div>
//         {clientMode === ClientMode.supplier && isCurrentSupplierBenefit && (
//           <div className={styles.updateContainer}>
//             {!isUpdateMode && (
//               <button
//                 className={styles.updateButton}
//                 onClick={() => setIsUpdateMode(true)}
//               >
//                 עידכון
//               </button>
//             )}
//             {isUpdateMode && (
//               <div>
//                 <button className={styles.saveButton} onClick={handleSave}>
//                   שמירה
//                 </button>
//                 <button
//                   className={styles.cancelButton}
//                   onClick={handleCancel}
//                 >
//                   ביטול
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BenefitDetails;

