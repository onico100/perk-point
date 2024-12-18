"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { SupplierFormValues, Category, Branch } from "@/types/types";
import styles from "@/styles/SignPages/sign.module.css";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useRouter } from "next/navigation";
import { checkEmailService } from "@/services/emailServices";
import { errorAlert, successAlert } from "@/utils/sweet-alerts";
import { getbranchesByBusinessName } from "@/services/branchesService";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';


export default function SignSupplierComponent() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { addSupplier } = useFetchSuppliers();
  const { categories, isLoadingCategories } = useFetchGeneral();
  const [emailExists, setEmailExists] = useState(false);
  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] = useState(false);
  const [branchDropdownVisible, setBranchDropdownVisible] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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


  const fetchBranches = debounce(async (textQuery: string, branchIndex: number) => {
    if (textQuery.trim().length >= 2) {
      try {
        setLoading(true);
        let allBranchesFromService = await getbranchesByBusinessName(textQuery)
        let citySuggestions = allBranchesFromService.map((place: Branch) => place.nameBranch)
        setSuggestions(citySuggestions);
        setBranchDropdownVisible(branchIndex);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setBranchDropdownVisible(null);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setBranchDropdownVisible(null);
    }
  }, 300);

  const toggleBranchDropdown = (index: number) => {
    if (branchDropdownVisible === index) {
      setBranchDropdownVisible(null);
    } else {
      fetchBranches(businessName, 0);
      setBranchDropdownVisible(index);
    }
  };


  const onBranchSelect = (branch: string) => {
    const extractCity = (branch: string): string => {
      const parts = branch.split(",");
      return parts.length >= 2 ? parts[1].trim() : "לא ידועה";
    };
    const city = extractCity(branch);
    const existingBranches = watch("branches");
    if (!existingBranches.some((b) => b.nameBranch === branch)) {
      append({ nameBranch: branch, city });
    }
  };

  const handleLogoUpload = async (result: CloudinaryUploadWidgetResults) => {
    setUploading(true);
    try {
      console.log("Upload result:", result);
      if (result && result.info && typeof result.info === "object" && "secure_url" in result.info) {
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

  const onSubmit = async (data: SupplierFormValues) => {
    console.log("SupplierFormValues:", data);
    const emailExists = await checkEmailService(data.email);
    if (emailExists) {
      setEmailExists(true);
      return;
    }


    addSupplier(data, {
      onSuccess: () => {
        successAlert("הספק נוסף בהצלחה!").then(() => {
          router.push("/");
        });
      },
      onError: (error: Error) => {
        console.error("Failed to add supplier:", error);
        errorAlert("שגיאה בהרשמת הספק. נסה שוב מאוחר יותר.");
      },
    });
  };


  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>


        {/* Business Name */}
        <div >
          <label htmlFor="businessName">שם העסק:</label>
          <input id="businessName" {...register("businessName")} className={styles.inputFieldField} />
          {errors.businessName && <p>{errors.businessName.message}</p>}
        </div>


        {/* Provider Name */}
        <div>
          <label htmlFor="providerName">
            שם ספק (יש להכניס שם פרטי ולא את שם העסק):
          </label>
          <input id="providerName" {...register("providerName")} />
          {errors.providerName && <p>{errors.providerName.message}</p>}
        </div>

        {/* Email */}
        <div >
          <label htmlFor="email">אימייל:</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>


        {/* Password */}
        <div >
          <label htmlFor="password">סיסמה:</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {/* Phone Number */}
        <div >
          <label htmlFor="phoneNumber">מספר טלפון:</label>
          <input id="phoneNumber" {...register("phoneNumber")} />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        </div>

        {/* Site Link */}
        <div >
          <label htmlFor="siteLink">קישור לאתר:</label>
          <input id="siteLink" type="url" {...register("siteLink")} />
          {errors.siteLink && <p>{errors.siteLink.message}</p>}
        </div>

        <div >
          <label htmlFor="supplierLogo">לוגו ספק:</label>
          <CldUploadWidget uploadPreset="PerkPoint" onSuccess={handleLogoUpload} >
            {({ open }) => {
              return (
                <button className={styles.uploadButton} onClick={() => open()}>
                  Upload an Image
                </button>
              );
            }}
          </CldUploadWidget>
          {errors.supplierLogo?.message && (
            <p className={styles.error}>{String(errors.supplierLogo.message)}</p>
          )}
        </div>

        {/* Categories Selection */}
        <div >
          <h2 className="font-bold">בחר קטגוריות:</h2>
          {isLoadingCategories ? (
            <p>טוען קטגוריות...</p>
          ) : (
            <div className={styles.dropdownContainer}>
              <button
                type="button"
                className={styles.dropdownButton}
                onClick={() => setIsCategoryDropdownVisible((prev) => !prev)} >
                בחר קטגוריות
              </button>
              {isCategoryDropdownVisible && (
                <div className={styles.dropdownContent}>
                  {categories?.map((category: Category) => (
                    <div key={category._id} className={styles.checkboxItem}>
                      <input type="checkbox" value={category._id} id={`category-${category._id}`} {...register("selectedCategories")} />
                      <label htmlFor={`category-${category._id}`}>{category.categoryName}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {errors.selectedCategories && <p className="text-red-500">{errors.selectedCategories.message}</p>}
        </div>


        {/* Branches */}
        <div >
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
        </div>


        {emailExists && (
          <div className="text-red-500 mb-4">
            <p>
              אימייל זה כבר קיים במערכת{" "}
              <br />
              <span
                className="text-red-500 underline cursor-pointer"
                onClick={() => router.push("/login-supplier")}
              >
                למעבר לדף התחברות
              </span>
            </p>
          </div>
        )}

        <button type="submit" className={styles.loginPageButton}>
          הרשמה
        </button>
      </form>
    </div>
  );
}

