"use client"
import { useFetchBenefits } from "@/hooks/useFetchBenefits";

const BenefitsContainer = () => {
  const { benefits, isLoading, isFetching } = useFetchBenefits();

  if (isLoading || isFetching) return <div>Loading...</div>;

  return (
    <div>   
        <ul>
          {benefits?.map((benefit) => (
            <li key={benefit._id}>{benefit.description}</li>
          ))}
        </ul>
    </div>
  );
};

export default BenefitsContainer;
