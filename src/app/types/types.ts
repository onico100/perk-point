import { ObjectId } from "mongodb";

export interface User {
    _id: string;
    username: string;
    email: string;
    clubs: string[];
    registrationDate: string;
    savedBenefits: string[];
    city: string;
  }

  export interface Supplier {
    providerName: String,
    password: String,
    email: String,
    businessName: String,
    categories:ObjectId[],
    phoneNumber: String,
    registrationDate: Date,
    branches:ObjectId[],
    supplierLogo:string,
  }