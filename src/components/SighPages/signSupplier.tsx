"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import my_http from "@/services/http";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { supplierSchema, SupplierFormValues } from "@/types/types";
import styles from "@/styles/SignPages/sign.module.css";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useRouter } from "next/navigation";

export default function SignSupplierComponent() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const { addSupplier } = useFetchSuppliers();
  const { categories, isLoadingC } = useFetchGeneral();

  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   control,
  //   watch,
  //   formState: { errors },
  // } = useForm<SupplierFormValues>({ resolver: zodResolver(supplierSchema), });

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

  const router = useRouter();

  const onSubmit = (data: SupplierFormValues) => {
    alert("onSubmit is triggered!");
    console.log("Form data:", data);
    addSupplier(data, {
      onSuccess: () => {
        alert("Supplier added successfully!");
        router.push("/");
      },
      onError: (error: Error) => {
        console.error("Failed to add supplier:", error);
        // alert("Failed to add supplier.");
      },
    });
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        {/* Business Name */}
        <div className={styles.formGroup}>
          <label htmlFor="businessName">שם העסק:</label>
          <input id="businessName" {...register("businessName")} />
          {errors.businessName && <p>{errors.businessName.message}</p>}
        </div>

        {/* Provider Name */}
        <div className={styles.formGroup}>
          <label htmlFor="providerName">
            שם ספק (יש להכניס שם פרטי ולא את שם העסק):
          </label>
          <input id="providerName" {...register("providerName")} />
          {errors.providerName && <p>{errors.providerName.message}</p>}
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">אימייל:</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label htmlFor="password">סיסמה:</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {/* Phone Number */}
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">מספר טלפון:</label>
          <input id="phoneNumber" {...register("phoneNumber")} />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        </div>

        {/* Site Link */}
        <div className={styles.formGroup}>
          <label htmlFor="siteLink">קישור לאתר:</label>
          <input id="siteLink" type="url" {...register("siteLink")} />
          {errors.siteLink && <p>{errors.siteLink.message}</p>}
        </div>

        {/* Supplier Logo */}
        <div className={styles.formGroup}>
          <label htmlFor="supplierLogo">קישור ללוגו:</label>
          <input id="supplierLogo" type="url" {...register("supplierLogo")} />
          {errors.supplierLogo && <p>{errors.supplierLogo.message}</p>}
        </div>

        {/* Categories Selection */}
        <div>
          <h2 className="font-bold">בחר קטגוריות:</h2>
          {isLoadingC ? (
            <p>טוען קטגוריות...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories?.map((category: any) => (
                <label
                  key={category._id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={category._id}
                    {...register("selectedCategories")}
                  />
                  {category.categoryName}
                </label>
              ))}
            </div>
          )}
          {errors.selectedCategories && (
            <p className="text-red-500">{errors.selectedCategories.message}</p>
          )}
        </div>

        {/* Branches */}
        <div className={styles.formGroup}>
          <h2 className="font-bold">סניפים:</h2>
          {fields.map((branch, index) => (
            <div key={branch.id}>
              {/* Branch Selection */}
              <div>
                <label htmlFor={`branches.${index}.branch`}>בחר סניף:</label>
                <input
                  id={`branches.${index}.branch`}
                  {...register(`branches.${index}.nameBranch` as const)}
                  onChange={(e) => fetchBranches(e.target.value, index)}
                  onFocus={() => setDropdownVisible(index)}
                  autoComplete="off"
                />
                {loading && dropdownVisible === index && <p>טוען...</p>}
                {dropdownVisible === index && suggestions.length > 0 && (
                  <div className={styles.dropdown}>
                    <ul>
                      {suggestions.map((place, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            if (place.includes(",")) {
                              const parts = place.split(",");
                              const cityBranch =
                                parts.length >= 2
                                  ? parts[1].trim()
                                  : "No city available";
                              setValue(`branches.${index}.nameBranch`, place);
                              setValue(`branches.${index}.city`, cityBranch);
                            } else {
                              setValue(`branches.${index}.nameBranch`, place);
                              setValue(
                                `branches.${index}.city`,
                                "No city available"
                              );
                            }
                            setSuggestions([]);
                            setDropdownVisible(null);
                          }}
                          className={styles.dropdownItem}
                        >
                          {place} -{" "}
                          {place.length >= 2
                            ? place[place.length - 2].trim()
                            : "No city available"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {errors.branches?.[index]?.nameBranch && (
                  <p>{errors.branches[index].nameBranch?.message}</p>
                )}
              </div>

              {/* Hidden Fields for Branch Name and City */}
              {/* <div className="hidden">
                <input
                  type="text"
                  {...register(`branches.${index}.nameBranch` as const)}
                  readOnly
                />
                <input
                  type="text"
                  {...register(`branches.${index}.city` as const)}
                  readOnly
                />
              </div> */}

              <button type="button" onClick={() => remove(index)}>
                הסר סניף
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ nameBranch: "", city: "" })}
          >
            הוסף סניף
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
        >
          הרשמה
        </button>
      </form>
    </div>
  );
}
