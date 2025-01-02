"use client";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { Category } from "@/types/Generaltypes";
import styles from "@/styles/SignPages/sign.module.css";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useRouter } from "next/navigation";
import { checkEmailService } from "@/services/emailServices";
import { errorAlert, successAlert } from "@/utils/sweet-alerts";
import { getbranchesByBusinessName } from "@/services/branchesService";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Supplier,
  SupplierFormValues,
  supplierSchema,
} from "@/types/SupplierTypes";
import { Branch } from "@/types/BenefitsTypes";

export default function SignSupplierComponent() {
  const [loading, setLoading] = useState(false);
  const { addSupplier } = useFetchSuppliers();
  const { categories, isLoadingCategories } = useFetchGeneral();
  const [emailExists, setEmailExists] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [ischooseCategories, setIschooseCategories] = useState(true);
  const [ischooseBranches, setIschooseBranches] = useState(false);
  const [googleSuggestions, setGoogleSuggestions] = useState<Branch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [selectAllBranches, setSelectAllBranches] = useState(false);
  const { suppliers } = useFetchSuppliers();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      branches: [],
      selectedCategories: [],
      supplierLogo: "",
    },
  });

  const containerBranchesRef = useRef(null);
  const containerCategoriesRef = useRef(null);

  const handleBlurCategories = (event: React.FocusEvent<HTMLDivElement>) => {
    const targetElement = containerCategoriesRef.current as HTMLElement | null;

    if (
      targetElement &&
      !targetElement.contains(event.relatedTarget as Node | null)
    ) {
      setIschooseCategories(true);
    }
  };

  const handleBlurBranches = (event: React.FocusEvent<HTMLDivElement>) => {
    const targetElement = containerBranchesRef.current as HTMLElement | null;

    if (
      targetElement &&
      !targetElement.contains(event.relatedTarget as Node | null)
    ) {
      setIschooseBranches(false);
    }
  };


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
        if (secureUrl && typeof secureUrl === "string")
          clearErrors("supplierLogo");
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

    const emailExists = await checkEmailService(data.email);
    if (emailExists) {
      setEmailExists(true);
      return;
    }

    let supplierNameExist = suppliers?.find(
      (s: Supplier) => s.businessName == data.businessName
    );
    if (supplierNameExist) {
      errorAlert("שם הספק כבר קיים");
      return;
    }

    let fullBranches = selectAllBranches
      ? googleSuggestions
      : googleSuggestions?.filter((b: Branch) =>
          data?.branches?.includes(b.nameBranch)
        );

    let dataToSend = {
      providerName: data.providerName,
      email: data.email.toLowerCase(),
      password: data.password,
      businessName: data.businessName,
      phoneNumber: data.phoneNumber,
      siteLink: data.siteLink,
      supplierLogo: data.supplierLogo,
      branches: fullBranches,
      selectedCategories: data.selectedCategories,
    };

    addSupplier(dataToSend, {
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

  const fetchGoogleSuggestions = async (businessName: string) => {
    if (!businessName) return;
    setLoading(true);
    try {
      const suggestions = await getbranchesByBusinessName(businessName);
      setGoogleSuggestions(suggestions);
    } catch (error) {
      errorAlert("שגיאה בטעינת סניפים מגוגל.");
    } finally {
      setLoading(false);
    }
  };

  const toggleGoogleSuggestion = (branch: Branch) => {

    const isSelected = selectedBranches.some(
      (b) => b.nameBranch == branch.nameBranch
    );
    if (isSelected) {
      setSelectedBranches((prev) =>
        prev.filter((b) => b.nameBranch !== branch.nameBranch)
      );
    } else {
      setSelectedBranches((prev) => [...prev, branch]);
    }
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <div>
          <label htmlFor="businessName">שם העסק:</label>
          <input
            className={styles.inputField}
            id="businessName"
            {...register("businessName")}
            onChange={(e) => fetchGoogleSuggestions(e.target.value)}
          />
          {errors.businessName && (
            <p className={styles.error}>{errors.businessName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="providerName">
            שם ספק (יש להכניס שם פרטי ולא את שם העסק):
          </label>
          <input
            className={styles.inputField}
            id="providerName"
            {...register("providerName")}
          />
          {errors.providerName && (
            <p className={styles.error}>{errors.providerName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email">אימייל:</label>
          <input
            className={styles.inputField}
            id="email"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">סיסמה:</label>
          <input
            className={styles.inputField}
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="phoneNumber">מספר טלפון:</label>
          <input
            className={styles.inputField}
            id="phoneNumber"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className={styles.error}>{errors.phoneNumber.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="siteLink">קישור לאתר:</label>
          <input
            className={styles.inputField}
            id="siteLink"
            type="url"
            {...register("siteLink")}
          />
          {errors.siteLink && (
            <p className={styles.error}>{errors.siteLink.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="supplierLogo">לוגו ספק:</label>
          <CldUploadWidget
            uploadPreset="PerkPoint"
            onSuccess={handleLogoUpload}
          >
            {({ open }) => {
              return (
                <button className={styles.uploadButton} onClick={() => open()}>
                  בחר לוגו
                </button>
              );
            }}
          </CldUploadWidget>
          {errors.supplierLogo?.message && (
            <p className={styles.error}>
              {String(errors.supplierLogo.message)}
            </p>
          )}
        </div>

        <div             className={styles.item}
            ref={containerCategoriesRef}
            tabIndex={-1}
            onBlur={handleBlurCategories}>
          <div>
            <div>
              <button
                onClick={() => setIschooseCategories(!ischooseCategories)}
                className={styles.selectButton}
                type="button"
              >
                <span>בחר קטגוריות: </span>
                {ischooseCategories ? <SlArrowDown /> : <SlArrowUp />}
              </button>
            </div>

            {!ischooseCategories &&
              (isLoadingCategories ? (
                <p>טוען קטגוריות...</p>
              ) : (
                <div className={styles.categoryList}>
                  {categories.map((c: Category) => (
                    <label key={c.categoryName} className={styles.branchLabel}>
                      <input
                        type="checkbox"
                        value={c._id}
                        {...register("selectedCategories")}
                      />
                      {c.categoryName}
                    </label>
                  ))}
                </div>
              ))}
          </div>

          {errors.selectedCategories && (
            <p className={styles.error}>{errors.selectedCategories.message}</p>
          )}
        </div>

        <div
          ref={containerBranchesRef}
          className={styles.item}
          tabIndex={-1}
          onBlur={handleBlurBranches}
        >
          <div>
            <button
              onClick={() => setIschooseBranches(!ischooseBranches)}
              className={styles.selectButton}
              type="button"
            >
              <span>בחר סניפים:</span>
              {!ischooseBranches ? <SlArrowDown /> : <SlArrowUp />}
            </button>
          </div>
          {ischooseBranches &&
            (googleSuggestions && googleSuggestions.length > 0 ? (
              <>
                <div className={styles.categoryList}>
                  <div className={styles.branchLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      value={"all"}
                      {...register("branches")}
                      onChange={() => {
                        if (!selectAllBranches) clearErrors("branches");
                        else trigger("branches");
                        setSelectAllBranches(!selectAllBranches);
                      }}
                    />
                    <span className={styles.branchName}>כל הסניפים</span>
                  </div>
                  {googleSuggestions.map((suggestion) => (
                    <label
                      key={suggestion.nameBranch}
                      className={styles.branchLabel}
                    >
                      <input
                        type="checkbox"
                        value={suggestion.nameBranch}
                        {...register("branches")}
                      />
                      <span className={styles.branchName}>
                        {suggestion.nameBranch}, {suggestion.city}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <>בחר שם עסק לטעינת סניפים</>
            ))}
          {errors.branches && (
            <p className={styles.error}>{errors.branches.message}</p>
          )}
        </div>

        {emailExists && (
          <div className="text-red-500 mb-4">
            <p>
              אימייל זה כבר קיים במערכת <br />
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
