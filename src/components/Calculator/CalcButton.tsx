import React from "react";
import { CalcButtonContainer, CalcButtonStyled, CalcButtonIcon } from './Calculator.Styles'; 


const CalcButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <CalcButtonContainer>
      <CalcButtonStyled onClick={onClick}>
        <CalcButtonIcon />
      </CalcButtonStyled>
    </CalcButtonContainer>
  );
};

export default CalcButton;
