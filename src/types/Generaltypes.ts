import { z } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

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

export interface ContactForm {
  _id: string;
  serialNumber: number;
  name: string;
  email: string;
  messageContent: string;
  createdAt: string;
  isActive: boolean;
  status: string;
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

export const isActiveSchema = z.object({
  isActive: z.boolean(),
});

export type UserGoogleFormValues = z.infer<typeof userGoogleSchema>;
