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

