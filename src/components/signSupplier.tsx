'use client';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import debounce from "lodash.debounce";
import my_http from "@/services/http";

const supplierSchema = z.object({
  providerName: z.string().min(3, "שם הספק חייב להיות לפחות 3 תווים."),
  email: z.string().email("כתובת אימייל אינה חוקית."),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים."),
  businessName: z.string().min(3, "יש להזין שם עסק בעל לפחות 3 תווים."),
  phoneNumber: z.string().regex(/^\d{10}$/, "מספר הטלפון חייב להיות באורך 10 ספרות."),
  siteLink: z.string().url("כתובת האתר אינה חוקית."),
  supplierLogo: z.string().url("כתובת ה- URL של הלוגו אינה חוקית."),
  city: z.string().min(1, "יש לבחור עיר מרשימת הערים."),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function SignSupplierComponent() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
  });

  const fetchCities = debounce(async (textQuery: string) => {
    if (!textQuery) {
      setSuggestions([]);
      return;
    }
  
    try {
      setLoading(true);
      console.log("query:", textQuery);
      const response = await my_http.post(`/googleAutocomplete/post`, {textQuery: textQuery });
      console.log("Response:", response.data); 
      setSuggestions(response.data.placePredictions.map((p: any) => p.structuredFormat.mainText.text));
    } 
    catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);
  

  const onSubmit = (data: SupplierFormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="add-supplier-page">
      <h1 className="text-center text-2xl font-bold">Add New Supplier</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto">
        <div>
          <label htmlFor="city" className="block text-sm font-medium">עיר:</label>
          <input
            id="city"
            type="text"
            className="w-full border rounded px-2 py-1"
            onChange={(e) => fetchCities(e.target.value)}
          />
          {loading && <p>Loading...</p>}
          <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
            {suggestions.map((city, index) => (
              <li
                key={index}
                className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                onClick={() => {
                  setValue("city", city);
                  setSuggestions([]);
                }}
              >
                {city}
              </li>
            ))}
          </ul>
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">
          קדימה, תרשמו אותי!
        </button>
      </form>
    </div>
  );
}
