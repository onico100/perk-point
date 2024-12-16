import { Benefit, Branch } from "@/types/types";


export interface UpdateState {
    isUpdateMode: boolean;
    updatedBenefit: Benefit | undefined;
    showBranches: boolean;
    dropdownVisible: boolean;
    selectedBranch: Branch | null;
}