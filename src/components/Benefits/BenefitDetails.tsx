// "use client";
// import { useFetchBenefits } from "@/hooks/useFetchBenefits";
// import { useEffect, useState } from "react";
// import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
// import { useFetchGeneral } from "@/hooks/useFetchGeneral";
// import { Benefit, Supplier, Club, ClientMode, Branch } from "@/types/types";
// import styles from "@/styles/Benefits/BenefitDetais.module.css";
// import { usePathname, useRouter } from "next/navigation";
// import useGeneralStore from "@/stores/generalStore";
// import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

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
//   const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
//   const [selectedBranch, setSelectedBranch] = useState(null); // State for the selected branch


//   const pathname = usePathname();
//   const specificBenefitId = pathname.split("/")[3];

//   const specificBenefit: Benefit | undefined = benefits?.find(
//     (benefit) => benefit._id === specificBenefitId
//   );
//   const specificSupplier: Supplier | undefined = suppliers?.find(
//     (supplier) => supplier._id === specificBenefit?.supplierId
//   );
//   const specificClub = clubs?.find(
//     (club: Club) => club._id === specificBenefit?.clubId
//   );

//   useEffect(() => {
//     if (isUpdateMode) {
//       setUpdatedBenefit(specificBenefit);
//     } else {
//       setUpdatedBenefit(specificBenefit);
//     }
//   }, [isUpdateMode, specificBenefit]);

//   const handleSave = async () => {
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
//           console.log("הטבה עודקנה בהצלחה");
//         }
//       } catch (error) {
//         console.error("Error updating benefit:", error);
//       }
//     }
//     setIsUpdateMode(false);
//   };

//   const handleChange = (field: keyof Benefit, value: string) => {
//     if (updatedBenefit) {
//       setUpdatedBenefit({
//         ...updatedBenefit,
//         [field]: field === "expirationDate" ? new Date(value) : value,
//       });
//     }
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

// const handleRemoveBranch = (branchToRemove: Branch) => {
//   if (updatedBenefit) {
//     setUpdatedBenefit({
//       ...updatedBenefit,
//       branches: updatedBenefit.branches.filter(
//         (branch) => branch !== branchToRemove
//       ),
//     });
//   }
// };

// const toggleDropdown = () => {
//   setDropdownVisible((prev) => !prev);
// };

//   const handleBack = () => {
//     router.back();
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


//   return (
//     <div className={styles.container}>
//       <button className={styles.backButton} onClick={handleBack}>
//         אחורה
//       </button>
//       {clientMode === ClientMode.supplier &&
//         isCurrentSupplierBenefit &&
//         !isUpdateMode && (
//           <div className={styles.updateButtons}>
//             <button
//               className={styles.updateButton}
//               onClick={() => setIsUpdateMode(true)}
//             >
//               עידכון
//             </button>
//           </div>
//         )}
//       {isUpdateMode && (
//         <div className={styles.updateButtons}>
//           <button className={styles.saveButton} onClick={handleSave}>
//             שמירה
//           </button>
//           <button
//             className={styles.cancelButton}
//             onClick={() => setIsUpdateMode(false)}
//           >
//             ביטול
//           </button>
//         </div>
//       )}
//       <h1 className={styles.title}>פרטי ההטבה</h1>
//       <div className={styles.supplierLogo}>
//         {specificSupplier && specificSupplier.supplierLogo ? (
//           <img
//             src={specificSupplier.supplierLogo}
//             alt={`${specificSupplier.providerName} logo`}
//             className={styles.logo}
//           />
//         ) : (
//           <div>אין לוגו זמין</div>
//         )}
//       </div>
//       <div className={styles.grid}>
//         <div className={styles.gridItem}>
//           <strong>תיאור:</strong> <br />
//           {isUpdateMode ? (
//             <textarea
//               value={updatedBenefit?.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//             />
//           ) : (
//             specificBenefit?.description
//           )}
//         </div>
//         <div className={styles.gridItem}>
//           <strong>מועדון:</strong>
//           <br />
//           {specificClub ? specificClub.clubName : "לא זמין"}
//         </div>
//         <div className={styles.gridItem}>
//           <strong>סניפים:</strong>
//           <br />
//           {isUpdateMode ? (
//             <>
//               {specificBenefit?.branches && specificBenefit.branches.length > 0 ? (
//                 <ul>
//                   {specificBenefit.branches.map((branch, index) => (
//                     <li key={index}>
//                       {branch.city}, {branch.nameBranch}
//                       <FaMinusCircle
//                         className={styles.icon}
//                         onClick={() => handleRemoveBranch(branch)}
//                       />
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div>כול הסניפים</div>
//               )}
//               <div className={styles.addBranch}>
//                 <FaPlusCircle
//                   className={styles.icon}
//                   onClick={toggleDropdown}
//                 />
//                 {dropdownVisible && (
//                   <div className={styles.dropdown}>
//                     <select
//                       onChange={(e) => {
//                         const branch = JSON.parse(e.target.value);
//                         setSelectedBranch(branch);
//                         handleAddBranch(branch);
//                       }}
//                     >
//                       <option value="">בחר סניף</option>
//                       {supplierBranches?.map((branch, index) => (
//                         <option key={index} value={JSON.stringify(branch)}>
//                           {branch.city}, {branch.nameBranch}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div>
//               {specificBenefit?.branches && specificBenefit.branches.length > 0 ? (
//                 <ul>
//                   {specificBenefit.branches.map((branch, index) => (
//                     <li key={index}>
//                       {branch.city}, {branch.nameBranch}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div>כול הסניפים</div>
//               )}
//             </div>
//           )}
//         </div>
//         <div className={styles.gridItem}>
//           <strong>תוקף:</strong>
//           <br />
//           {isUpdateMode ? (
//             <input
//               type="date"
//               value={
//                 updatedBenefit?.expirationDate
//                   ? new Date(updatedBenefit.expirationDate)
//                     .toISOString()
//                     .split("T")[0]
//                   : " "
//               }
//               onChange={(e) => handleChange("expirationDate", e.target.value)}
//             />
//           ) : specificBenefit?.expirationDate ? (
//             new Date(specificBenefit.expirationDate).toLocaleDateString(
//               "he-IL",
//               {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               }
//             )
//           ) : (
//             "Not Available"
//           )}
//         </div>
//         <div className={styles.gridItem}>
//           <strong>הגבלות:</strong>
//           <br />
//           {isUpdateMode ? (
//             <textarea
//               value={updatedBenefit?.redemptionConditions}
//               onChange={(e) =>
//                 handleChange("redemptionConditions", e.target.value)
//               }
//             />
//           ) : (
//             specificBenefit?.redemptionConditions
//           )}
//         </div>
//         <div className={styles.gridItem}>
//           <div className={styles.gridItem}>
//             {specificClub && specificClub.clubLink ? (
//               <div className={styles.businessLink}>
//                 <a
//                   href={specificClub.clubLink}
//                   className={styles.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {specificClub ? specificClub.clubName : "מעבר לאתר ההטבה"}               
//                 </a>
//               </div>
//             ) : (
//               <div>קישור לא קיים</div>
//             )}
//           </div>
//           <div className={styles.gridItem}>
//             {specificSupplier && specificSupplier.siteLink ? (
//               <div className={styles.businessLink}>
//                 <a
//                   href={specificSupplier.siteLink}
//                   className={styles.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   למעבר לבית העסק
//                 </a>
//               </div>
//             ) : (
//               <div>קישור לא קיים</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BenefitDetails;

"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { useEffect, useState } from "react";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { Benefit, Supplier, Club, ClientMode, Branch } from "@/types/types";
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { usePathname, useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { FaPlusCircle, FaMinusCircle, FaMapMarkerAlt } from "react-icons/fa";

const BenefitDetails = () => {
  const router = useRouter();
  const { benefits, isLoadingB, isFetchingB, updateBenefit } = useFetchBenefits();
  const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
  const { clubs, isLoadingCategories, isFetchingCategories } = useFetchGeneral();
  const clientMode = useGeneralStore((state) => state.clientMode);
  const currentSupplier = useGeneralStore((state) => state.currentSupplier);

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updatedBenefit, setUpdatedBenefit] = useState<Benefit | undefined>(
    undefined
  );
  const [showBranches, setShowBranches] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
  const [selectedBranch, setSelectedBranch] = useState(null); // State for the selected branch

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
    if (isUpdateMode) {
      setUpdatedBenefit(specificBenefit);
    } else {
      setUpdatedBenefit(specificBenefit);
    }
  }, [isUpdateMode, specificBenefit]);

  const handleSave = async () => {
    if (updatedBenefit) {
      try {
        if (updatedBenefit._id) {
          await updateBenefit({
            id: updatedBenefit._id,
            updatedData: {
              description: updatedBenefit.description,
              redemptionConditions: updatedBenefit.redemptionConditions,
              expirationDate: updatedBenefit.expirationDate,
              branches: updatedBenefit.branches,
              isActive: updatedBenefit.isActive,
            },
          });
          console.log("הטבה עודכנה בהצלחה");
        }
      } catch (error) {
        console.error("Error updating benefit:", error);
      }
    }
    setIsUpdateMode(false);
  };

  const toggleBranches = () => setShowBranches((prev) => !prev);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleAddBranch = (branch: Branch) => {
    if (updatedBenefit) {
      setUpdatedBenefit({
        ...updatedBenefit,
        branches: [...updatedBenefit.branches, branch],
      });
      setSelectedBranch(null);
      setDropdownVisible(false);
    }
  };

  const handleRemoveBranch = (branchToRemove: Branch) => {
    if (updatedBenefit) {
      setUpdatedBenefit({
        ...updatedBenefit,
        branches: updatedBenefit.branches.filter(
          (branch) => branch !== branchToRemove
        ),
      });
    }
  };

  const handleChange = (field: keyof Benefit, value: string) => {
    if (updatedBenefit) {
      setUpdatedBenefit({
        ...updatedBenefit,
        [field]: field === "expirationDate" ? new Date(value) : value,
      });
    }
  };

  if (
    isLoadingB ||
    isFetchingB ||
    isLoadingS ||
    isFetchingS ||
    isLoadingCategories ||
    isFetchingCategories
  )
    return <div>Loading...</div>;

  const isCurrentSupplierBenefit =
    currentSupplier &&
    specificSupplier &&
    currentSupplier._id === specificSupplier._id;

  const supplierBranches = specificSupplier ? specificSupplier.branches : [];


  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()}>
        אחורה
      </button>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <div className={styles.rightColumn}>
            <div className={styles.infoContainer}>
              <label htmlFor="description" className={styles.infoLabel}>
                תיאור ההטבה:
              </label>
              <textarea
                id="description"
                className={styles.infoBox}
                value={updatedBenefit?.description || ""}
                readOnly={!isUpdateMode}
                onChange={(e) => handleChange("description", e.target.value)
                }
              />
            </div>
            {specificClub && specificClub.clubLink ? (
              <a
                href={specificClub.clubLink}
                className={styles.button}
                target="_blank"
                rel="noopener noreferrer"
              >
                מעבר להטבה: {specificClub ? specificClub.clubName : ""}
              </a>
            ) : (
              <div>אין קישור למועדון</div>
            )}
            <div className={styles.infoContainer}>
              <label htmlFor="conditions" className={styles.infoLabel}>
                הגבלות:
              </label>
              <textarea
                id="conditions"
                className={styles.infoBox}
                value={updatedBenefit?.redemptionConditions || ""}
                readOnly={!isUpdateMode}
                onChange={(e) => handleChange("redemptionConditions", e.target.value)}
              />
              <label htmlFor="expirationDate" className={styles.infoLabel}>
                תוקף:
              </label>
              {isUpdateMode ? (
                <input
                  type="date"
                  className={styles.infoBox}
                  value={
                    updatedBenefit?.expirationDate
                      ? new Date(updatedBenefit.expirationDate)
                        .toISOString()
                        .split("T")[0]
                      : " "
                  }
                  onChange={(e) => handleChange("expirationDate", e.target.value)}
                />
              ) : specificBenefit?.expirationDate ? (
                new Date(specificBenefit.expirationDate).toLocaleDateString(
                  "he-IL",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
              ) : (
                "Not Available"
              )}
            </div>
          </div>
          <div className={styles.leftColumn}>
            {specificSupplier && specificSupplier.supplierLogo ? (
              <img
                src={specificSupplier.supplierLogo}
                alt="Supplier Logo"
                className={styles.logo}
              />
            ) : (
              <div>אין לוגו זמין</div>
            )}
            <div className={styles.branches}>
              <div className={styles.branchLink}>
                <FaMapMarkerAlt className={styles.icon} />
                <span onClick={toggleBranches} className={styles.branchText}>
                  רשימת הסניפים
                </span>
              </div>
              {showBranches && (
                <>
                  {specificBenefit?.branches && specificBenefit.branches.length > 0 ? (
                    <ul className={styles.branchList}>
                      {specificBenefit.branches.map((branch, index) => (
                        <li key={index} className={styles.branchItem}>
                          <div className={styles.branchInfo}>
                            {isUpdateMode && (
                              <FaMinusCircle
                                className={styles.icon}
                                onClick={() => handleRemoveBranch(branch)}
                              />
                            )}
                            {branch.city}, {branch.nameBranch}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>כול הסניפים</div>
                  )}
                  {isUpdateMode && (
                    <div className={styles.addBranch}>
                      <FaPlusCircle className={styles.icon} onClick={toggleDropdown} />
                      {dropdownVisible && (
                        <div className={styles.dropdown}>
                          <select
                            onChange={(e) => {
                              const branch = JSON.parse(e.target.value);
                              setSelectedBranch(branch);
                              handleAddBranch(branch);
                            }}
                          >
                            <option value="">בחר סניף</option>
                            {supplierBranches?.map((branch, index) => (
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
            {specificSupplier && specificSupplier.siteLink ? (
              <a
                href={specificSupplier.siteLink}
                className={styles.button}
                target="_blank"
                rel="noopener noreferrer"
              >
                מעבר לאתר העסק
              </a>
            ) : (
              <div>אין קישור לעסק</div>
            )}
          </div>
        </div>
        {clientMode === ClientMode.supplier && isCurrentSupplierBenefit && (
          <div className={styles.updateContainer}>
            {!isUpdateMode && (
              <button
                className={styles.updateButton}
                onClick={() => setIsUpdateMode(true)}
              >
                עידכון
              </button>
            )}
            {isUpdateMode && (
              <div>
                <button className={styles.saveButton} onClick={handleSave}>
                  שמירה
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsUpdateMode(false)}
                >
                  ביטול
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BenefitDetails;
