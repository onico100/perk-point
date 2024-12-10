"use client";

import { Category, Supplier } from "@/types/types";
import styles from "@/styles/PersonalDetails.module.css";
import { useState, useEffect } from "react";
import { MdOutlineModeEditOutline, MdOutlineEditOff } from "react-icons/md";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useGeneralStore from "@/stores/generalStore";
import {
  beforeActionAlert,
  errorAlert,
  successAlert,
} from "@/utils/sweet-alerts";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";

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
  //supplierLogo: z.string().url("כתובת ה- URL של הלוגו אינה חוקית."),
  supplierLogo: z.string().url("כתובת ה- URL של הלוגו אינה חוקית.")
  .optional()
  .or(z.literal("")),
  selectedCategories: z.array(z.string()).refine(
    (selectedCategories) => {
      return selectedCategories.length > 0;
    },
    { message: "נא לבחור לפחות קטגוריה אחד" }
  ),
  //branches: z.array(branchSchema).nonempty("חייב להוסיף לפחות סניף אחד."),
  // selectedCategories: z.array(z.string()).nonempty("חייב לבחור לפחות קטגוריה אחת."),
});

console.log("bbb")
export default function SupplierPersonalDetails({
  currentSupplier,
}: SupplierPersonalDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const { categories } = useGeneralStore();
  const { updateSupplier } = useFetchSuppliers();
  const [selectAll, setSelectAll] = useState(true);
  const [uploading, setUploading] = useState(false);

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
      console.log(currentSupplier)
    }
  }, [editMode, currentSupplier, setValue]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "PerkPoint"); 
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          setValue("supplierLogo", data.secure_url);
          successAlert("העלאת תמונה הצליחה!");
        }
      } catch (error) {
        errorAlert("שגיאה בהעלאת התמונה");
      } finally {
        setUploading(false);
      }
    }
  };



  const editSupplier = async (data: any) => {
    try {
      const alertConfirm = await beforeActionAlert("", "עריכה");
      if (alertConfirm) {
        if (currentSupplier?._id) {
          console.log(data)
          await updateSupplier(
            {
              id: currentSupplier._id,
              updatedData: {
                providerName: data?.providerName,
                password: currentSupplier?.password,
                email: data?.email,
                businessName: data?.businessName,
                categories: currentSupplier?.categories,
                phoneNumber: data?.phoneNumber,
                registrationDate: currentSupplier?.registrationDate,
                //change to data.---
                branches: currentSupplier?.branches,
                siteLink: data?.siteLink,
                supplierLogo: data?.supplierLogo,
                isActive: currentSupplier?.isActive,
                selectedCategories: data?.selectedCategories,
              },
            },
            {
              onSuccess: () => {
                console.log(25,currentSupplier)
                successAlert("ספק נערך ");
              },
              onError: () => {
                errorAlert("שגיאה בעריכת ספק");
              },
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
        <button
          className={styles.editButton}
          onClick={() => setEditMode(!editMode)}
        >
          {!editMode ? <MdOutlineModeEditOutline /> : <MdOutlineEditOff />}
        </button>
      </div>
      {currentSupplier.supplierLogo && (
           <p className={styles.item}>
           <span className={styles.label}>לוגו ספק:</span>
           {editMode ? (
             <>
               <input
                 className={styles.input}
                 id="supplierLogo"
                 type="url"
                 {...register("supplierLogo")}
                 defaultValue={currentSupplier?.supplierLogo}
                 placeholder="או הכנס קישור"
               />              <input
               id="logoUpload"
               type="file"
               accept="image/*"
               onChange={handleLogoUpload}
             />
             {uploading && <p>Uploading...</p>}
           </>
         ) : (
           currentSupplier?.supplierLogo && (
             <img
               src={currentSupplier.supplierLogo}
               alt="לוגו ספק"
               className={styles.logo}
             />
           )
         )}
       
       </p>
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
        {errors.email?.message && (
          <p className={styles.error}>{String(errors.email.message)}</p>
        )}
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
          {new Date(currentSupplier.registrationDate).toLocaleDateString(
            "he-IL"
          )}
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
        {errors.siteLink?.message && (
          <p className={styles.error}>{String(errors.siteLink.message)}</p>
        )}
      </p>

      <p className={styles.item}>
        <span className={styles.label}>קטגוריות:</span>
        {editMode ? (
          <div className={styles.inputContainer}>
            <div>
              <button
                onClick={() => setSelectAll(!selectAll)}
                className={styles.selectButton}
              >
                <span>בחר קטגוריות</span>
                {!selectAll ? <SlArrowUp /> : <SlArrowDown />}
              </button>
            </div>

            {!selectAll && (
              <div className={styles.categoryList}>
                {categories.map((c: Category) => (
                  <label key={c.categoryName} className={styles.branchLabel}>
                    <input
                      type="checkbox"
                      value={c._id}
                      {...register("selectedCategories")}
                      defaultChecked={
                        currentSupplier?.selectedCategories?.includes(c._id) 
                      }
                    />
                    {c.categoryName}
                  </label>
                ))}
              </div>
            )}

            {errors.selectedCategories && !selectAll && (
              <span className={styles.error}>
                {errors.selectedCategories.message as string}
              </span>
            )}
          </div>
        ) : (
          <div>
            {currentSupplier &&
            currentSupplier.selectedCategories &&
            currentSupplier?.selectedCategories?.length > 1
              ? categories
                  .filter((category: Category) =>
                    currentSupplier?.selectedCategories?.some(
                      (supplierCategoryId) =>
                        supplierCategoryId.toString() === category._id
                    )
                  )
                  .map((category: Category) => (
                    <div key={category._id}>° {category.categoryName}</div>
                  ))
              : "אין קטגוריות"}
          </div>
        )}
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
            {editMode && (
          <button
            className={styles.submitButton}
            onClick={handleSubmit(editSupplier)}
          >
            שמור
          </button>
        )}
    </div>
  );
}
