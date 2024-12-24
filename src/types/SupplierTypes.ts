import { ObjectId } from "mongodb";
import { z } from "zod";
import { Branch } from "./BenefitsTypes";

export const passwordSchema = z
  .string()
  .min(6, "סיסמה חייבת להכיל לפחות 6 תווים.")
  .regex(/[A-Za-z]/, "סיסמה חייבת להכיל לפחות אות אחת.")
  .regex(/\d/, "סיסמה חייבת להכיל לפחות ספרה אחת.");

export const branchSchema = z.object({
  nameBranch: z.string().min(1, "יש לבחור סניף."),
  city: z.string().min(3, "יש לבחור עיר."),
});

export const categorySchema = z.object({
  categoryName: z.string().min(3, "שם קטגוריה חייב להיות לפחות 3 תווים."),
});

export const supplierSchema = z.object({
  providerName: z.string().min(3, "שם הספק חייב להיות לפחות 3 תווים."),
  email: z.string().email("כתובת אימייל אינה חוקית."),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים."),
  businessName: z.string().min(3, "יש להזין שם עסק בעל לפחות 3 תווים."),
  phoneNumber: z
    .string()
    .regex(/^\d{9,10}$/, "מספר הטלפון חייב להיות באורך 10 ספרות."),
  siteLink: z.string().url("כתובת האתר אינה חוקית."),
  supplierLogo: z.string().url("כתובת ה- URL של הלוגו אינה חוקית."),
  branches: z.array(z.string()).nonempty("חייב לבחור לפחות סניף אחד."),
  selectedCategories: z
    .array(z.string())
    .nonempty("חייב לבחור לפחות קטגוריה אחת."),
});

export interface Supplier {
  _id?: string;
  providerName: string;
  password: string;
  email: string;
  businessName: string;
  categories?: ObjectId[];
  phoneNumber: string;
  registrationDate?: Date;
  branches?: Branch[];
  siteLink?: string;
  supplierLogo?: string;
  isActive?: boolean;
  selectedCategories?: string[];
}

export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type BranchZ = z.infer<typeof branchSchema>;
export type CategoryZ = z.infer<typeof categorySchema>;
