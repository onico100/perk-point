import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { getAllSuppliers } from "@/services/suppliersServices";
import { Benefit, Branch, Club, Supplier } from "@/types/types";

export const getActiveClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "ACTIVE");
};

export const getApiClubs = (clubs: Club[]) => {
  console.log(333, "in clubs");
  return clubs.filter((c: Club) => c.APIData);
};

export const getInactiveClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "INACTIVE");
};

export const getPendingClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "PENDING");
};

export const getActiveNotApiClubs = (clubs: Club[]) => {
  return getActiveClubs(clubs).filter((c: Club) => !c.APIData);
};

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

export const getBenefitsClubsWithSupplierId = async (
  benefits: BenefitInput[]
): Promise<Benefit[]> => {
  try {
    // Wait for suppliers to be fetched
    const suppliers = await getAllSuppliers();
    if (!suppliers || suppliers.length === 0) {
      throw new Error("No suppliers found or error fetching suppliers");
    }

    // Create a supplier lookup map for efficient access
    const supplierMap = new Map(
      suppliers.map((supplier) => [supplier.businessName, supplier._id])
    );

    return benefits.map((benefit) => {
      const supplierId = supplierMap.get(benefit.supplierName);
      if (!supplierId) {
        throw new Error(
          `Supplier with name "${benefit.supplierName}" not found`
        );
      }

      return {
        _id: benefit._id,
        supplierId, // Use supplierId from the map
        clubId: benefit.clubId,
        redemptionConditions: benefit.redemptionConditions,
        description: benefit.description,
        expirationDate: new Date(benefit.expirationDate),
        branches: benefit.branches,
        isActive: benefit.isActive,
      };
    });
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
