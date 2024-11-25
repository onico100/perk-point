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
  }


  export interface Benefit {
    _id?: string;
    supplierId: string;
    clubId: string;
    redemptionConditions: string;
    description: string;
    expirationDate: Date;
    clubLink: string;
    branches: Branch[];
    isActive: boolean;
  }
  
  export interface Branch {
    city: string;
    address: string;
  }

  export interface Supplier {
    _id: string;
    providerName: String;
    password: String;
    email: String;
    businessName: String;
    categories:ObjectId[];
    phoneNumber: String;
    registrationDate: Date;

    branches:Branch[];
    supplierLogo:string;
  }


