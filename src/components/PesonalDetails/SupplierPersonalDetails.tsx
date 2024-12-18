"use client";

import { Branch, Category, Supplier } from "@/types/types";
import styles from "@/styles/PersonalDetails/PersonalDetails.module.css";
import { useState, useEffect } from "react";
import { MdOutlineModeEditOutline, MdOutlineEditOff } from "react-icons/md";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useGeneralStore from "@/stores/generalStore";
import {
  beforeActionAlert,
  errorAlert,
  successAlert,
} from "@/utils/sweet-alerts";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { getbranchesByBusinessName } from "@/services/branchesService";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';


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

  supplierLogo: z
    .string()
    .url("כתובת ה- URL של הלוגו אינה חוקית.")
    .optional()
    .or(z.literal("")),

  selectedCategories: z.array(z.string()).refine(
    (selectedCategories) => {
      return selectedCategories.length > 0;
    },
    { message: "נא לבחור לפחות קטגוריה אחד" }
  ),

  branches: z.array(z.string()).refine(
    (branches) => {
      return branches.length > 0;
    },
    { message: "נא לבחור לפחות סניף אחד" }
  ),
});

export default function SupplierPersonalDetails({
  currentSupplier,
}: SupplierPersonalDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const { categories } = useGeneralStore();
  const { updateSupplier } = useFetchSuppliers();
  const [ischooseCategories, setIschooseCategories] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [allBranches, setAllBranches] = useState<any[]>([]);
  const [booleanResults, setBooleanResults] = useState<boolean[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const isExample =
    currentSupplier.email == "supplier@example.com" ? true : false;
  useEffect(() => {
    if (editMode) {
      let booleanResults2: boolean[] = allBranches.map(
        (b: Branch) =>
          currentSupplier?.branches?.some(
            (branch: Branch) => branch.nameBranch === b.nameBranch
          ) as boolean
      );
      setBooleanResults(booleanResults2);

      const containsAllBranches = booleanResults2.every((b) => b === true);
      setSelectAll(containsAllBranches);

      setValue("providerName", currentSupplier?.providerName);
      setValue("email", currentSupplier?.email);
      setValue("businessName", currentSupplier?.businessName);
      setValue("phoneNumber", currentSupplier?.phoneNumber);
      setValue("siteLink", currentSupplier?.siteLink);
      setValue("supplierLogo", currentSupplier?.supplierLogo);
      setValue("selectedCategories", currentSupplier?.selectedCategories);
      setValue(
        "branches",
        selectAll
          ? allBranches?.map((b) => b.nameBranch)
          : currentSupplier?.branches?.map((b) => b.nameBranch)
      );
    }
  }, [editMode, currentSupplier, setValue]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleLogoUpload = async (result: CloudinaryUploadWidgetResults) => {
    setUploading(true); 
    try {
      if (
        result &&
        result.info &&
        typeof result.info === "object" &&
        "secure_url" in result.info
      ) {
        const secureUrl = result.info.secure_url as string;

        setValue("supplierLogo", secureUrl);
        await successAlert("העלאת תמונה הצליחה!"); 
      } else {
        throw new Error("שגיאה בהעלאת התמונה"); 
      }
    } catch (error) {
      console.error("Error during upload:", error);
      errorAlert("שגיאה בהעלאת התמונה");
    } finally {
      setUploading(false); 
    }
  };

  const editSupplier = async (data: any) => {
    try {
      const alertConfirm = await beforeActionAlert("");
      if (alertConfirm) {
        if (currentSupplier?._id) {
          let updatedBranches = selectAll
            ? allBranches
            : allBranches?.filter((b) => data.branches.includes(b.nameBranch));

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
                branches: updatedBranches,
                siteLink: data?.siteLink,
                supplierLogo: data?.supplierLogo,
                isActive: currentSupplier?.isActive,
                selectedCategories: data?.selectedCategories,
              },
            },
            {
              onSuccess: () => {
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

  const fetchBranches = async () => {
    let textQuery = currentSupplier?.businessName;

    if (textQuery.trim().length >= 2) {
      try {
        let allBranchesFromService = await getbranchesByBusinessName(textQuery);

        setAllBranches(allBranchesFromService);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setAllBranches([]);
      }
    } else {
      setAllBranches([]);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>פרטי ספק</h2>
      {isExample && editMode && (
        <h3>הנך במצב משתמש לדוגמא לכן לא תוכל לערוך שם או אימייל. </h3>
      )}
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
            <CldUploadWidget uploadPreset="PerkPoint" onSuccess={handleLogoUpload} >
              {({ open }) => {
                return (
                  <button className={styles.uploadButton} onClick={() => open()}>
                    החלפת לוגו
                  </button>
                );
              }}
            </CldUploadWidget>
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
        {!isExample && editMode ? (
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
        {!isExample && editMode ? (
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
                onClick={() => setIschooseCategories(!ischooseCategories)}
                className={styles.selectButton}
              >
                <span>בחר קטגוריות</span>
                {!ischooseCategories ? <SlArrowUp /> : <SlArrowDown />}
              </button>
            </div>

            {!ischooseCategories && (
              <div className={styles.categoryList}>
                {categories.map((c: Category) => (
                  <label key={c.categoryName} className={styles.branchLabel}>
                    <input
                      type="checkbox"
                      value={c._id}
                      {...register("selectedCategories")}
                      defaultChecked={currentSupplier?.selectedCategories?.includes(
                        c._id
                      )}
                    />
                    {c.categoryName}
                  </label>
                ))}
              </div>
            )}

            {errors.selectedCategories && !ischooseCategories && (
              <span className={styles.error}>
                {errors.selectedCategories.message as string}
              </span>
            )}
          </div>
        ) : (
          <div>
            {currentSupplier &&
              currentSupplier.selectedCategories &&
              currentSupplier?.selectedCategories?.length > 0
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

      <p>
        <span className={styles.label}>
          {" "}
          <a href="/supplier-branches/0">
            לעריכת בניפים יש לעבור לעמוד עריכת סניפים
          </a>
        </span>
      </p>
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
