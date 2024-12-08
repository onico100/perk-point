import React from "react";
import { FaCalculator } from "react-icons/fa";
// import styles from "@/styles/Calc.module.css";
import styled from "styled-components";

const CalcButtonWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
`;

const Button = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(to bottom right, #b346e8, #87cdfa);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const Icon = styled(FaCalculator)`
  font-size: 24px;
`;

const CalcButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <CalcButtonWrapper>
      <Button onClick={onClick}>
        <Icon />
      </Button>
    </CalcButtonWrapper>
  );
};

export default CalcButton;
