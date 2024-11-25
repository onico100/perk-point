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
    validity: Date;
    clubLink: string;
    branches: Branch[];
    isActive: boolean;
  }
  
  export interface Branch {
    city: string;
    address: string;
  }
  
