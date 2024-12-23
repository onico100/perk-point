import { getAllSuppliers } from "@/services/suppliersServices";
import { BenefitInput } from "@/types/benefits/types";
import { Benefit, Branch, Club, Supplier } from "@/types/types";

export const getActiveClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "ACTIVE");
};

export const getApiClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.APIData && c.clubStatus == "ACTIVE");
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

export const getBenefitsClubsWithSupplierId = async (
  benefits: BenefitInput[]
): Promise<Benefit[]> => {
  try {
    const suppliers = await getAllSuppliers();
    if (!suppliers || suppliers.length === 0) {
      throw new Error("No suppliers found or error fetching suppliers");
    }

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
        supplierId,
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
    throw error;
  }
};
