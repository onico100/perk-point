import { ObjectId } from "mongodb";

export interface User {
    _id: string;
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
    _id: string;
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
    categories?:ObjectId[];
    phoneNumber: string;
    registrationDate?: Date;
    branches?:Branch[];
    siteLink?: string;
    supplierLogo?:string;
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
    isActive:Boolean;    
  }

  export enum ClientMode {
    general = "GENERAL",
    connection = "CONNECTION",
    supplier = "SUPPLIER",
    user = "USER"
  }

  export enum PreMode{
    supplier = "SUPPLIER",
    user = "USER",
    none="NONE",
  }
