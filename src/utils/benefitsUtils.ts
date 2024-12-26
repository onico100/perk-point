import { Benefit } from "@/types/BenefitsTypes";

export const getVaildBenefits = (benefits: Benefit[]) => {
  return benefits.filter((benefit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(benefit.expirationDate);
    expirationDate.setHours(0, 0, 0, 0);
    return expirationDate >= today;
  });
};

export const getUnVAildBenefits = (benefits: Benefit[]) => {
  return benefits.filter((benefit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(benefit.expirationDate);
    expirationDate.setHours(0, 0, 0, 0);
    return expirationDate < today;
  });
};

export const sortBenefitsByCounter = (benefits: Benefit[]) => {
  return benefits.sort((a, b) => b.counter - a.counter);
};
