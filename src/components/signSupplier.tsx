'use client';
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import debounce from "lodash.debounce";
import my_http from "@/services/http";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";

const branchSchema = z.object({
  city: z.string().min(1, "יש לבחור עיר."),
  address: z.string().min(3, "כתובת חייבת להכיל לפחות 3 תווים."),
});

const supplierSchema = z.object({
  providerName: z.string().min(3, "שם הספק חייב להיות לפחות 3 תווים."),
  email: z.string().email("כתובת אימייל אינה חוקית."),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים."),
  businessName: z.string().min(3, "יש להזין שם עסק בעל לפחות 3 תווים."),
  phoneNumber: z.string().regex(/^\d{10}$/, "מספר הטלפון חייב להיות באורך 10 ספרות."),
  siteLink: z.string().url("כתובת האתר אינה חוקית."),
  supplierLogo: z.string().url("כתובת ה- URL של הלוגו אינה חוקית."),
  branches: z.array(branchSchema).nonempty("חייב להוסיף לפחות סניף אחד."),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function SignSupplierComponent() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const { addSupplier } = useFetchSuppliers();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  const fetchCities = debounce(async (textQuery: string, branchIndex: number) => {
    if (!textQuery) {
      setSuggestions([]);
      setDropdownVisible(null);
      return;
    }

    try {
      setLoading(true);
      const response = await my_http.post(`/googleAutocomplete/post`, { textQuery });
      const citySuggestions = response.data.places.map((place: any) => place.displayName.text);
      setSuggestions(citySuggestions);
      setDropdownVisible(branchIndex);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setDropdownVisible(null);
    } finally {
      setLoading(false);
    }
  }, 500);

  const onSubmit = (data: SupplierFormValues) => {
    console.log("Form data:", data);
    addSupplier(data, {
      onSuccess: () => {
        alert("Supplier added successfully!");
      },
      onError: (error: Error) => {
        console.error("Failed to add supplier:", error);
        alert("Failed to add supplier.");
      },
    });
  };

  return (
    <div className="add-supplier-page">
      <h1 className="text-center text-2xl font-bold">Add New Supplier</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto">
        {/* Provider Name */}
        <div>
          <label htmlFor="providerName">שם ספק:</label>
          <input id="providerName" {...register("providerName")} />
          {errors.providerName && <p>{errors.providerName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">אימייל:</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">סיסמה:</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="businessName">שם העסק:</label>
          <input id="businessName" {...register("businessName")} />
          {errors.businessName && <p>{errors.businessName.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber">מספר טלפון:</label>
          <input id="phoneNumber" {...register("phoneNumber")} />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        </div>

        {/* Site Link */}
        <div>
          <label htmlFor="siteLink">קישור לאתר:</label>
          <input id="siteLink" type="url" {...register("siteLink")} />
          {errors.siteLink && <p>{errors.siteLink.message}</p>}
        </div>

        {/* Supplier Logo */}
        <div>
          <label htmlFor="supplierLogo">קישור ללוגו:</label>
          <input id="supplierLogo" type="url" {...register("supplierLogo")} />
          {errors.supplierLogo && <p>{errors.supplierLogo.message}</p>}
        </div>

        {/* Branches */}
        <div>
          <h2 className="font-bold">סניפים:</h2>
          {fields.map((branch, index) => (
            <div key={branch.id} className="flex flex-col gap-2 border p-2 mb-2">
              {/* City */}
              <div>
                <label htmlFor={`branches.${index}.city`}>עיר:</label>
                <input
                  id={`branches.${index}.city`}
                  {...register(`branches.${index}.city` as const)}
                  onChange={(e) => fetchCities(e.target.value, index)}
                  onFocus={() => setDropdownVisible(index)}
                />
                {loading && dropdownVisible === index && <p>Loading...</p>}
                {dropdownVisible === index && suggestions.length > 0 && (
                  <ul className="border rounded bg-white z-10 absolute">
                    {suggestions.map((city, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setValue(`branches.${index}.city`, city);
                          setSuggestions([]);
                          setDropdownVisible(null);
                        }}
                        className="cursor-pointer"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
                {errors.branches?.[index]?.city && <p>{errors.branches[index].city?.message}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor={`branches.${index}.address`}>רחוב:</label>
                <input id={`branches.${index}.address`} {...register(`branches.${index}.address` as const)} />
                {errors.branches?.[index]?.address && <p>{errors.branches[index].address?.message}</p>}
              </div>

              <button type="button" onClick={() => remove(index)}>הסר סניף</button>
            </div>
          ))}

          <button type="button" onClick={() => append({ city: "", address: "" })}>
            הוסף סניף
          </button>
        </div>

        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">
          קדימה, תרשמו אותי!
        </button>
      </form>
    </div>
  );
}
