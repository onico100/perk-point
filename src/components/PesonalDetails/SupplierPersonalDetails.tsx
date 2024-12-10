"use client";

import { Category, Supplier } from "@/types/types";
import styles from "@/styles/PersonalDetails.module.css";
import { useState, useEffect } from "react";
import { MdOutlineModeEditOutline,MdOutlineEditOff  } from "react-icons/md";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useGeneralStore from "@/stores/generalStore";
import { beforeActionAlert, errorAlert, successAlert } from "@/utils/sweet-alerts";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";

// import debounce from "lodash.debounce";
// import my_http from "@/services/http";


interface SupplierPersonalDetailsProps {
  currentSupplier: Supplier;
}

const formSchema = z.object({
  providerName: z.string().min(3, "שם הספק חייב להיות לפחות 3 תווים."),
  email: z.string().email("כתובת אימייל אינה חוקית."),
  businessName: z.string().min(3, "יש להזין שם עסק בעל לפחות 3 תווים."),
  phoneNumber: z
    .string()
    .regex(/^\d{9,10}$/, "מספר הטלפון חייב להיות באורך 10 ספרות."),
  siteLink: z.string().url("כתובת האתר אינה חוקית."),
  supplierLogo: z.string().url("כתובת ה- URL של הלוגו אינה חוקית."),
  //branches: z.array(branchSchema).nonempty("חייב להוסיף לפחות סניף אחד."),
 // selectedCategories: z.array(z.string()).nonempty("חייב לבחור לפחות קטגוריה אחת."),
});

export default function SupplierPersonalDetails({
  currentSupplier,
}: SupplierPersonalDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const { categories } = useGeneralStore();
  const {updateSupplier}=useFetchSuppliers()

  // const [suggestions, setSuggestions] = useState<string[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [branchDropdownVisible, setBranchDropdownVisible] = useState<number | null>(null);
  
  // const { control, watch } = useForm({
  //   defaultValues: {
  //     branches: [],
  //   },
  // });
  
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "branches",
  // });
  
  // const businessName = watch("businessName");
  
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (editMode) {
      setValue("providerName", currentSupplier?.providerName);
      setValue("email", currentSupplier?.email);
      setValue("businessName", currentSupplier?.businessName);
      setValue("phoneNumber", currentSupplier?.phoneNumber);
      setValue("siteLink", currentSupplier?.siteLink);
      setValue("supplierLogo", currentSupplier?.supplierLogo);
    }
  }, [editMode, currentSupplier, setValue]);

  // useEffect(() => {
  //   if (businessName) {
  //     fetchBranches(businessName, 0);
  //   }
  // }, [businessName]);
  
  // const fetchBranches = debounce(async (textQuery: string, branchIndex: number) => {
  //   if (textQuery.trim().length >= 2) {
  //     try {
  //       setLoading(true);
  //       const response = await my_http.post(`/googleAutocomplete/post`, {
  //         textQuery,
  //       });
  //       const branchesFromGoogle = response.data.formattedPlaces;
  //       const citySuggestions = branchesFromGoogle
  //         ? branchesFromGoogle.map((place: any) => place.name + " " + place.address)
  //         : [];
  //       setSuggestions(citySuggestions);
  //       setBranchDropdownVisible(branchIndex);
  //     } catch (error) {
  //       console.error("Error fetching suggestions:", error);
  //       setSuggestions([]);
  //       setBranchDropdownVisible(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     setSuggestions([]);
  //     setBranchDropdownVisible(null);
  //   }
  // }, 300);

  // const toggleBranchDropdown = (index: number) => {
  //   if (branchDropdownVisible === index) {
  //     setBranchDropdownVisible(null);
  //   } else {
  //     fetchBranches(businessName, 0);
  //     setBranchDropdownVisible(index);
  //   }
  // };
  
  // const onBranchSelect = (branch: string) => {
  //   const extractCity = (branch: string): string => {
  //     const parts = branch.split(",");
  //     return parts.length >= 2 ? parts[1].trim() : "לא ידועה";
  //   };
  //   const city = extractCity(branch);
  //   const existingBranches = watch("branches");
  //   if (!existingBranches.some((b) => b.nameBranch === branch)) {
  //     append({ nameBranch: branch, city });
  //   }
  // };
  

  const editSupplier = async(data: any) => {
    try {
      const alertConfirm = await beforeActionAlert("", "עריכה");
      if (alertConfirm) {
        if (currentSupplier?._id) {

          await updateSupplier(
            {
              id: currentSupplier._id,
              updatedData: {
                providerName: data?.providerName,
                password:currentSupplier?.password,
                email: data?.email,
                businessName: data?.businessName,
                //change to data.---
                categories: currentSupplier?.categories,
                phoneNumber: data?.phoneNumber,
                registrationDate: currentSupplier?.registrationDate,
                //change to data.---
                branches: currentSupplier?.branches,
                siteLink: data?.siteLink,
                supplierLogo: data?.supplierLogo,
                isActive: currentSupplier?.isActive,
                selectedCategories: currentSupplier?.selectedCategories,
              },
            },
            {
              onSuccess: () => {
                successAlert("ספק נערך ");
              },
              onError:() => {
                errorAlert("שגיאה בעריכת ספק");
              }
            }
          );
        }
      }
    } catch (err) {
      console.error("Error editing user:", err);
      errorAlert("שגיאה בעריכת ספק");
    } finally {
      setEditMode(false);
    }

  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>פרטי ספק</h2>
      <div className={styles.buttonsContainer}>
        {editMode && (
          <button className={styles.submitButton} onClick={handleSubmit(editSupplier)}>
            שמור 
          </button>
        )}
        <button
          className={styles.editButton}
          onClick={() => setEditMode(!editMode)}
        >
          {!editMode ?(<MdOutlineModeEditOutline />):(<MdOutlineEditOff />)}
        </button>
      </div>
      {currentSupplier.supplierLogo && (
        <>
          <img
            src={currentSupplier.supplierLogo}
            alt="לוגו ספק"
            className={styles.logo}
          />
          {editMode && (
            <>
              <span className={styles.label}>לוגו ספק:</span>
              <input
                className={styles.input}
                id="supplierLogo"
                type="url"
                {...register("supplierLogo")}
                defaultValue={currentSupplier?.supplierLogo} 
              />
              {errors.supplierLogo?.message && (
                <p className={styles.error}>{String(errors.supplierLogo.message)}</p>
              )}
            </>
          )}
        </>
      )}

      <p className={styles.item}>
        <span className={styles.label}>שם ספק:</span>
        {editMode ? (
          <input
            id="providerName"
            {...register("providerName")}
            className={styles.input}
            defaultValue={currentSupplier?.providerName} 
          />
        ) : (
          currentSupplier.providerName
        )}
        {errors.providerName?.message && (
          <p className={styles.error}>{String(errors.providerName.message)}</p>
        )}
      </p>

      <p className={styles.item}>
        <span className={styles.label}>אימייל:</span>
        {editMode ? (
          <input
            className={styles.input}
            id="email"
            type="email"
            {...register("email")}
            defaultValue={currentSupplier?.email} 
          />
        ) : (
          currentSupplier.email
        )}
        {errors.email?.message && <p className={styles.error}>{String(errors.email.message)}</p>}
      </p>

      <p className={styles.item}>
        <span className={styles.label}>שם עסק:</span>
        {editMode ? (
          <input
            className={styles.input}
            id="businessName"
            {...register("businessName")}
            defaultValue={currentSupplier?.businessName}
          />
        ) : (
          currentSupplier.businessName
        )}
        {errors.businessName?.message && (
          <p className={styles.error}>{String(errors.businessName.message)}</p>
        )}
      </p>

      <p className={styles.item}>
        <span className={styles.label}>מספר טלפון:</span>
        {editMode ? (
          <input
            className={styles.input}
            id="phoneNumber"
            {...register("phoneNumber")}
            defaultValue={currentSupplier?.phoneNumber} 
          />
        ) : (
          currentSupplier.phoneNumber
        )}
        {errors.phoneNumber?.message && (
          <p className={styles.error}>{String(errors.phoneNumber.message)}</p>
        )}
      </p>

      {currentSupplier.registrationDate && (
        <p className={styles.item}>
          <span className={styles.label}>תאריך הרשמה:</span>
          {new Date(currentSupplier.registrationDate).toLocaleDateString("he-IL")}
        </p>
      )}

      <p className={styles.item}>
        <span className={styles.label}>קישור לאתר:</span>
        {editMode ? (
          <input
            id="siteLink"
            type="url"
            {...register("siteLink")}
            className={styles.input}
            defaultValue={currentSupplier?.siteLink} 
          />
        ) : (
          <a
            href={currentSupplier.siteLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {currentSupplier.siteLink}
          </a>
        )}
        {errors.siteLink?.message && <p className={styles.error}>{String(errors.siteLink.message)}</p>}
      </p>

      <p className={styles.item}>
        <span className={styles.label}>קטגוריות:</span>
        {currentSupplier &&
        currentSupplier.categories &&
        currentSupplier?.categories?.length > 1
          ? categories
              .filter((category: Category) =>
                currentSupplier?.categories?.some(
                  (supplierCategoryId) =>
                    supplierCategoryId.toString() === category._id
                )
              )
              .map((category: Category) => (
                <div key={category._id}>°{category.categoryName}</div>
              ))
          : " אין קטגוריות "}
      </p>
{/* "העתקה מתמר- מהרשמת ספק" */}
      {/* <div className={styles.formGroup}>
      <h2 className="font-bold">סניפים:</h2>
      <button
        type="button"
        onClick={() => toggleBranchDropdown(0)}
        className={styles.dropdownButton}
      >
        בחר סניפים
        <span>{branchDropdownVisible === 0 ? "▲" : "▼"}</span>
      </button>
      {branchDropdownVisible === 0 && (
        <div className={styles.dropdownBranches}>
          {loading ? (
            <p>טוען...</p>
          ) : (
            suggestions.map((branch, idx) => (
              <label key={idx} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  value={branch}
                  onChange={() => onBranchSelect(branch)}
                />
                {branch}
              </label>
            ))
          )}
        </div>
      )}
      <ul>
        {fields.map((branch, index) => (
          <li key={branch.id} className={styles.selectedBranch}>
            {branch.nameBranch} - {branch.city}
            <button type="button" onClick={() => remove(index)}>
              הסר
            </button>
          </li>
        ))}
      </ul>
    </div>*/}

    </div> 
  );
}