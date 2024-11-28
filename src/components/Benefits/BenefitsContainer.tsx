"use client"
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import BenefitsCard from "./BenefitCard";

const BenefitsContainer = () => {
  const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();

  if (isLoadingB || isFetchingB) return <div>Loading...</div>;

  return (
    <div>   
        <ul>
          {benefits?.map((benefit) => (
            <li key={benefit._id}>
              <BenefitsCard benefit={benefit}></BenefitsCard>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default BenefitsContainer;
