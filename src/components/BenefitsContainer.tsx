"use client"
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import BenefitsCard from "./BenefitCard";

const BenefitsContainer = () => {
  const { benefits, isLoading, isFetching } = useFetchBenefits();

  if (isLoading || isFetching) return <div>Loading...</div>;

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
