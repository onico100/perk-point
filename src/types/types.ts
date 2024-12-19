import { ObjectId } from "mongodb";
import { z } from "zod";

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
  branches: z.array(branchSchema).nonempty("חייב להוסיף לפחות סניף אחד."),
  selectedCategories: z
    .array(z.string())
    .nonempty("חייב לבחור לפחות קטגוריה אחת."),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type BranchZ = z.infer<typeof branchSchema>;
export type CategoryZ = z.infer<typeof categorySchema>;

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
  nameBranch: string;
  city: string;
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
  selectedCategories?: string[];
}

export interface Admin {
  _id?: string;
  username: string;
  email: string;
  password: string;
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
  clubLogo: string;
  isActive: Boolean;
  APIData: Boolean;
  clubRoute?: string;
  clubStatus: ClubStatus;
}

export enum ClientMode {
  general = "GENERAL",
  connection = "CONNECTION",
  supplier = "SUPPLIER",
  user = "USER",
  admin = "ADMIN",
}

export const userSchema = z.object({
  username: z.string().min(3, "שם המשתמש חייב להיות לפחות 3 תווים."),
  email: z.string().email("כתובת אימייל אינה חוקית."),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים."),
  city: z.string().min(2, "יש להזין עיר."),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const userGoogleSchema = z.object({
  username: z.string().min(3, "שם המשתמש חייב להיות לפחות 3 תווים."),
  email: z.string().email("כתובת אימייל אינה חוקית."),
  password: z.string().nullable(),
  city: z.string().nullable(),
  isActive: z.boolean().nullable(),
  clubs: z.array(z.string()).nullable(),
  savedBenefits: z.array(z.string()).nullable(),
  registrationDate: z.string().nullable(),
});

export type UserGoogleFormValues = z.infer<typeof userGoogleSchema>;

export enum ClubStatus {
  active = "ACTIVE",
  inactive = "INACTIVE",
  pending = "PENDING",
}
