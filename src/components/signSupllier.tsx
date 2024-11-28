"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchSupplier } from "@/hooks/useFetchSupplier";

const supplierSchema = z.object({
  providerName: z.string().min(3, "Provider name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  businessName: z.string().min(3, "Business name must be at least 3 characters."),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
  siteLink: z.string().url("Invalid URL."),
  supplierLogo: z.string().url("Invalid URL."),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function AddSupplier() {
  const { addSupplier } = useFetchSupplier(); // שימוש ב-Hook הקיים

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
  });

  const onSubmit = (data: SupplierFormValues) => {
    addSupplier(data, {
      onSuccess: () => { alert("Supplier added successfully!");},
      onError: (error) => {
        console.error(error);
        alert("Failed to add supplier.");
      },
    });
  };

  return (
    <div className="add-supplier-page">
      <h1 className="text-center text-2xl font-bold">Add New Supplier</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto">
        <div>
          <label htmlFor="providerName" className="block text-sm font-medium">
            Provider Name:
          </label>
          <input
            id="providerName"
            type="text"
            {...register("providerName")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.providerName && <p className="text-red-500 text-sm">{errors.providerName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email:
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password:
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium">
            Business Name:
          </label>
          <input
            id="businessName"
            type="text"
            {...register("businessName")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Phone Number:
          </label>
          <input
            id="phoneNumber"
            type="text"
            {...register("phoneNumber")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <label htmlFor="siteLink" className="block text-sm font-medium">
            Website Link:
          </label>
          <input
            id="siteLink"
            type="url"
            {...register("siteLink")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.siteLink && <p className="text-red-500 text-sm">{errors.siteLink.message}</p>}
        </div>

        <div>
          <label htmlFor="supplierLogo" className="block text-sm font-medium">
            Supplier Logo (URL):
          </label>
          <input
            id="supplierLogo"
            type="url"
            {...register("supplierLogo")}
            className="w-full border rounded px-2 py-1"
          />
          {errors.supplierLogo && <p className="text-red-500 text-sm">{errors.supplierLogo.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
        >
          Add Supplier
        </button>
      </form>
    </div>
  );
}
