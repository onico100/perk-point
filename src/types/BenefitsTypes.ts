import { z } from "zod";

export interface UpdateState {
  isUpdateMode: boolean;
  updatedBenefit: Benefit | undefined;
  showBranches: boolean;
  dropdownVisible: boolean;
  selectedBranch: Branch | null;
}

export interface BenefitInput {
  _id: string;
  supplierName: string;
  clubId: string;
  redemptionConditions: string;
  description: string;
  expirationDate: string | Date;
  branches: Branch[];
  isActive: boolean;
}

export interface Branch {
  nameBranch: string;
  city: string;
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
  counter: number;
}

export interface BenefitApi {
  _id?: string;
  benefitId: string;
  counter: number;
  isActive: boolean;
}

export const benefitSchema = z.object({
  supplierId:z
  .string()
  .min(2, "מזהה ספק חייב לכלול לפחות 2 תווים"),
  redemptionConditions: z
    .string()
    .min(2, "הגבלות ההטבה חייבות לכלול לפחות 2 תווים"),
  description: z.string().min(2, "תיאור ההטבה חייב לכלול לפחות 2 תווים"),
  expirationDate: z
    .string()
    .min(1, "תאריך הוא שדה חובה")
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
      },
      { message: "תאריך חייב להיות בהווה או בעתיד" }
    ),
  clubId: z.string().min(1, "נא לבחור מועדון"),
  branches: z.array(z.string()).refine(
    (branches) => {
      return branches.length > 0;
    },
    { message: "נא לבחור לפחות סניף אחד" }
  ),
  counter: z.number().int().min(0, "חובה להזין מספר חיובי"),
});

export const benefitApiSchema = z.object({
  benefitId: z.string().min(2, "מזהה הטבה חייב לכלול לפחות 2 תווים" ),
  counter: z.number().int().min(0, "חובה להזין מספר חיובי"),
  isActive: z.boolean(),
});
