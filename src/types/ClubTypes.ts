import { z } from "zod";

export interface addClubForm {
  _id: string;
  clubName: string;
  clubLink: string;
  clubLogo?: string;
  route?: string;
  comments?: string;
  email: string;
  isActive: boolean;
  status: string;
}

export interface Club {
  _id?: string;
  clubName: string;
  clubLink: string;
  clubLogo: string;
  isActive: Boolean;
  APIData: Boolean;
  clubRoute?: string;
  clubStatus: ClubStatus;
  createdAt?: Date;
  email: string;
}


export enum ClubStatus {
  active = "פעיל",
  inactive = "בוטל",
  pending = "ממתין",
}

export const clubSchema = z.object({
  clubName: z.string().min(1, "שם המועדון חייב להיות מלא."),
  clubLink: z.string().url("לינק לא חוקי."),
  clubLogo: z.string().url("כתובת ה- URL של הלוגו אינה חוקית.").optional(),
  route: z.string().optional(),
  comments: z.string().optional(),
  email: z.string().email("כתובת אימייל לא חוקית."),
});

