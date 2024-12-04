import { ObjectId } from "mongodb";
import { z } from "zod";

export const branchSchema = z.object({
  city: z.string().min(1, "יש לבחור עיר."),
  address: z.string().min(3, "כתובת חייבת להכיל לפחות 3 תווים."),
});

export const supplierSchema = z.object({
  providerName: z.string().min(3, "שם הספק חייב להיות לפחות 3 תווים."),
  email: z.string().email("כתובת אימייל אינה חוקית."),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים."),
  businessName: z.string().min(3, "יש להזין שם עסק בעל לפחות 3 תווים."),
  phoneNumber: z.string().regex(/^\d{9,10}$/, "מספר הטלפון חייב להיות באורך 10 ספרות."),
  siteLink: z.string().url("כתובת האתר אינה חוקית."),
  supplierLogo: z.string().url("כתובת ה- URL של הלוגו אינה חוקית."),
  branches: z.array(branchSchema).nonempty("חייב להוסיף לפחות סניף אחד."),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type BranchZ = z.infer<typeof branchSchema>;

export interface User {
  _id?: string;
  username: string;
  email: string;
  clubs: string[];
  registrationDate: string;
  savedBenefits: string[];
  city: string;
  isActive: boolean;
  password: String;
}

export interface Benefit {
  _id?: string;
  supplierId: string;
  clubId: string;
  redemptionConditions: string;
  description: string;
  expirationDate: Date;
  branches: Branch[];
  isActive: boolean;
}

export interface Branch {
  city: string;
  address: string;
}

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
}

export interface Category {
  _id: string;
  categoryName: string;
  isActive: boolean;
}

export interface Club {
  _id: string;
  clubName: string;
  clubLink: string;
  clubLogo:string;
  isActive: Boolean;
}

export enum ClientMode {
  general = "GENERAL",
  connection = "CONNECTION",
  supplier = "SUPPLIER",
  user = "USER",
}

export enum PreMode {
  supplier = "SUPPLIER",
  user = "USER",
  none = "NONE",
}
