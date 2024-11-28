"use client";

import React from "react";
import { Benefit } from "@/types/types";

interface BenefitsCardProps {
  benefit: Benefit;
}

const BenefitsCard: React.FC<BenefitsCardProps> = ({ benefit }) => {
  return (
    <div className="benefit-card">
      <h2>{benefit.description}</h2>
    </div>
  );
};

export default BenefitsCard;
