"use client";

import { Category } from "@/types/Generaltypes";
import styles from "@/styles/PersonalDetails/PersonalDetails.module.css";
import { useState, useEffect } from "react";
import { MdOutlineModeEditOutline, MdOutlineEditOff } from "react-icons/md";
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
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Supplier, supplierSchema } from "@/types/SupplierTypes";
import { Branch } from "@/types/BenefitsTypes";

interface SupplierPersonalDetailsProps {
  currentSupplier: Supplier;
}

export default function SupplierPersonalDetails({
  currentSupplier,
}: SupplierPersonalDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const { categories } = useGeneralStore();
  const { updateSupplier } = useFetchSuppliers();
  const [ischooseCategories, setIschooseCategories] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      password:"00000000",
      branches: ["branches"],
      selectedCategories: currentSupplier.selectedCategories,
      providerName: currentSupplier.providerName,
      email: currentSupplier.email,
      businessName: currentSupplier.businessName,
      phoneNumber: currentSupplier.phoneNumber,
      siteLink: currentSupplier.siteLink,
      supplierLogo: currentSupplier.supplierLogo,
    },
  });

  const isExample =
    currentSupplier.email == "supplier@example.com" ? true : false;

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
                branches: currentSupplier?.branches,
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
            <CldUploadWidget
              uploadPreset="PerkPoint"
              onSuccess={handleLogoUpload}
            >
              {({ open }) => {
                return (
                  <button
                    className={styles.uploadButton}
                    onClick={() => open()}
                  >
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
                    <div key={category._id}>• {category.categoryName}</div>
                  ))
              : "אין קטגוריות"}
          </div>
        )}
      </p>

      <p>
        <span className={styles.label}>
          {" "}
          <a href="/supplier-branches/0">
            לניהול סניפים יש <u>לעבור לעמוד עריכת סניפים</u>
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
