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
