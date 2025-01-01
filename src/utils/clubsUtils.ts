import { getAllSuppliers } from "@/services/suppliersServices";
import { getAllBenefitsApi, addBenefitApi } from "@/services/BenefitApiServices";
import { Benefit, BenefitInput, BenefitApi } from "@/types/BenefitsTypes";
import { Club } from "@/types/ClubTypes";
import { counter } from "@fortawesome/fontawesome-svg-core";

export const getActiveClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "פעיל");
};

export const getApiClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.APIData && c.clubStatus == "פעיל");
};

export const getInactiveClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "בוטל");
};

export const getPendingClubs = (clubs: Club[]) => {
  return clubs.filter((c: Club) => c.clubStatus == "ממתין");
};

export const getActiveNotApiClubs = (clubs: Club[]) => {
  return getActiveClubs(clubs).filter((c: Club) => !c.APIData);
};
export const getBenefitsClubsWithSupplierId = async (
  benefits: BenefitInput[]
): Promise<Benefit[]> => {
  try {
    const suppliers = await getAllSuppliers();
    if (!suppliers) {
      throw new Error("Error fetching suppliers");
    }
    if (suppliers.length === 0) {
      return [];
    }

    const supplierMap = new Map(
      suppliers.map((supplier) => [supplier.businessName, supplier._id])
    );

    const allBenefitsAPI = await getAllBenefitsApi();
    const benefitCounterMap = new Map(
      allBenefitsAPI.map((benefitApi) => [benefitApi.benefitId, benefitApi.counter])
    );

    const mappedBenefits: (Benefit | null)[] = await Promise.all(benefits.map(async (benefit) => {
      const supplierId = supplierMap.get(benefit.supplierName);
      if (!supplierId) {
        return null;
      }

      let counter = benefitCounterMap.get(benefit._id);
      if (counter === undefined) {
        const newBenefitApi: BenefitApi = {
          benefitId: benefit._id,
          counter: 0,
          isActive: true,
        };
        const createdBenefitApi = await addBenefitApi(newBenefitApi);
        counter = createdBenefitApi.counter;
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
        counter,
      };
    }));

    return mappedBenefits.filter((benefit) => benefit !== null);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
