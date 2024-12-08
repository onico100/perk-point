"use client";

import styles from "@/styles/PersonalDetails.module.css";
import useGeneralStore from "@/stores/generalStore";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { Category, Club, SupplierFormValues } from "@/types/types";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import my_http from "@/services/http";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";

export default function PersonalDetails() {
  const { currentUser, currentSupplier, categories } = useGeneralStore();
  const [editMode,setEditMode]=useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const { addSupplier } = useFetchSuppliers();
  console.log("categories:", categories);
  const [emailExists, setEmailExists] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    defaultValues: {
      selectedCategories: [],
      branches: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  const businessName = watch("businessName");

  useEffect(() => {
    if (businessName) {
      fetchBranches(businessName, 0);
    }
  }, [businessName]);

  const fetchBranches = debounce(
    async (textQuery: string, branchIndex: number) => {
      if (textQuery.trim().length >= 2) {
        try {
          setLoading(true);
          const response = await my_http.post(`/googleAutocomplete/post`, {
            textQuery,
          });
          const branchesFromGoogle = response.data.formattedPlaces;
          const citySuggestions = branchesFromGoogle
            ? branchesFromGoogle.map(
                (place: any) => place.name + " " + place.address
              )
            : [];

          setSuggestions(citySuggestions);
          setDropdownVisible(branchIndex);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setDropdownVisible(null);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setDropdownVisible(null);
      }
    },
    300
  );

  if (!currentUser && !currentSupplier) {
    return <LoadingSpinner />;
  }

  if (currentUser) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>פרטי משתמש</h2>
        <p className={styles.item}>
          <span className={styles.label}>שם משתמש:</span>
           {currentUser.username}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>אימייל:</span> {currentUser.email}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>עיר:</span> {currentUser.city}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>תאריך הרשמה:</span>{" "}
          {new Date(currentUser.registrationDate).toLocaleDateString("he-IL")}
        </p>
      </div>
    );
  }

  if (currentSupplier) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>פרטי ספק</h2>
        {currentSupplier.supplierLogo && (
          <img
            src={currentSupplier.supplierLogo}
            alt="לוגו ספק"
            className={styles.logo}
          />
        )}
        <p className={styles.item}>
          <span className={styles.label}>שם ספק:</span>{" "}
          {currentSupplier.providerName}
          <input id="businessName" {...register("businessName")} />
          {errors.businessName && <p>{errors.businessName.message}</p>}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>אימייל:</span> {currentSupplier.email}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>שם עסק:</span>{" "}
          {currentSupplier.businessName}
        </p>
        <p className={styles.item}>
          <span className={styles.label}>מספר טלפון:</span>{" "}
          {currentSupplier.phoneNumber}
        </p>
        {currentSupplier.registrationDate && (
          <p className={styles.item}>
            <span className={styles.label}>תאריך הרשמה:</span>{" "}
            {new Date(currentSupplier.registrationDate).toLocaleDateString(
              "he-IL"
            )}
          </p>
        )}
        <p className={styles.item}>
          <span className={styles.label}>קטגוריות:</span>
          {currentSupplier && currentSupplier.categories &&currentSupplier?.categories?.length > 1 ?
           categories.filter((category: Category) =>
                  currentSupplier?.categories?.some(
                    (supplierCategoryId) =>
                      supplierCategoryId.toString() === category._id
                  )
                )
                .map((category: Category) => (
                  <div key={category._id}>{category.categoryName}</div>
                ))
            : " אין קטגוריות " }
        </p>
        <button className={styles.submitButton}>ערוך</button>
      </div>
    );
  }
}
