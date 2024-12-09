import styled from 'styled-components';
import { FaCalculator, FaChevronDown, FaChevronRight  } from 'react-icons/fa';



export const Form = styled.form`
  margin-bottom: 20px;
`;

export const InputContainer = styled.div`
  margin-bottom: 15px;
`;

export const Input = styled.input`
  width: calc(100% - 10px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: darkblue;
  }
`;

export const CalcSidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 25%;
  height: 100vh;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  align-items: center;
  text-align: center;
  z-index: 10000;

  h1 {
    font-size: 20px;
    background: linear-gradient(to right, #b346e8, #87cdfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const Headline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 10px;
`;

export const Dropdown = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 10px;
  padding: 10px 20px;
  border-radius: 20px;
  background: linear-gradient(to right, #b346e8, #87cdfa);
`;

export const IconDown =styled(FaChevronDown)`
  margin-right: 10px;
`;

export const IconRight =styled(FaChevronRight)`
  margin-right: 10px;
`;

export const DiscountSection = styled.div`
  text-align: start;

  h3 {
    font-weight: bold;
  }

  form {
    font-family: Arial, sans-serif;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    align-items: center;

    div {
      margin-bottom: 15px;
      position: relative;
    }

    label {
      display: block;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        background: linear-gradient(to right, #b346e8, #87cdfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    input {
      width: calc(100% - 10px);
      margin-top: 8px;
      padding: 10px;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    button {
      background: linear-gradient(to bottom, #b346e8, #87cdfa);
      color: white;
      border: none;
      width: 140px;
      border-radius: 10px;
      cursor: pointer;
      padding: 10px 5px;
    }
  }
`;

export const ProductList = styled.div`
  margin-top: 20px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const AddProduct = styled.div`
  margin-top: 20px;
  text-align: center;

  button {
    background: linear-gradient(to bottom, #b346e8, #87cdfa);
    color: white;
    border: none;
    width: 140px;
    border-radius: 10px;
    cursor: pointer;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: linear-gradient(to right, #b346e8, #87cdfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
  text-align: center;
  line-height: 1;
`;

export const CalcButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
`;

export const CalcButtonStyled = styled.button`
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

export const CalcButtonIcon = styled(FaCalculator)`
  font-size: 24px;
`;