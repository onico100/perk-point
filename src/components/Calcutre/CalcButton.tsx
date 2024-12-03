import React from "react";
import { FaCalculator } from "react-icons/fa";
import styles from "@/styles/Calc.module.css";

const CalcButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className={styles.calcButton}>
      <button onClick={onClick}>
        <FaCalculator className={styles.calcButtonIcon} />
      </button>
    </div>
  );
};

export default CalcButton;
