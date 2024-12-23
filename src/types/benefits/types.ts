import { Benefit, Branch } from "@/types/types";

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
