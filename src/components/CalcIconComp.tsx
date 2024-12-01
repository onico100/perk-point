import React from "react";
import { FaCalculator } from "react-icons/fa";

const CalcButton: React.FC = () => {
  return (
    <div style={styles.container}>
      <button style={styles.button}>
        <FaCalculator style={styles.icon} />
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    bottom: "20px",
    left: "20px",
  },
  button: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(to bottom right, #b346e8, #87cdfa)", // Corrected here
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  },
  icon: {
    fontSize: "24px",
  },
};

export default CalcButton;
