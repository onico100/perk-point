import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { Benefit, Club } from "@/types/types";

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

export const getBenefitsClubsWithSupplierId = (
  benefits: any[],
  suppliers: any[]
): Benefit[] => {
  // Transform the benefits array
  return benefits.map((benefit) => {
    const supplier = suppliers.find((s) => s.name === benefit.supplierName);

    if (!supplier) {
      throw new Error(`Supplier with name "${benefit.supplierName}" not found`);
    }

    return {
      _id: benefit._id,
      supplierId: supplier._id, // Add supplier ID from the matched supplier
      clubId: benefit.clubId,
      redemptionConditions: benefit.redemptionConditions,
      description: benefit.description,
      expirationDate: new Date(benefit.expirationDate),
      branches: benefit.branches,
      isActive: benefit.isActive,
    };
  });
};
