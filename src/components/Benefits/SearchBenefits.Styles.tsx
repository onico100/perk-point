import styled from "styled-components";
import { FaSearch, FaSync, FaChevronDown } from "react-icons/fa";

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  position: relative;
  margin-bottom: 0;
`;

export const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: grey;
`;

export const InputContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 100px;
  max-width: 200px;

  &:focus-within ${SearchIcon} {
    color: black;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SelectContainer = styled.div<{ $isOpen: boolean }>`
  flex: 1;
  min-width: 100px;
  max-width: 200px;
  background-color: white;
  padding: 0;
  border: 1.5px solid ${({ $isOpen }) => ($isOpen ? `white` : `transparent`)};
  border-radius: 7px;
  box-shadow: inset 0 0 0 2px
    ${({ $isOpen }) => ($isOpen ? `black` : `transparent`)};
  position: relative;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0.4)};
  height: 40px;
  transition: opacity 0.3s;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SelectLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: grey;
  padding: 5px;
  border-radius: 7px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  width: 100%;
`;

export const SupplierInput = styled.input`
  padding: 10px;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 7px;
  opacity: 0.4;
  width: 100%;
  height: 40px;
  font-size: 14px;
  color: black;

  &:focus {
    opacity: 1;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  padding: 10px;
  left: 0;
  opacity: 1;
`;

export const FaChevronDownIcon = styled(FaChevronDown)`
  color: grey;
`;

export const DropdownOption = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;
`;

export const DateLabel = styled.label`
  color: black;
`;

export const DateInput = styled.input`
  padding: 10px;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 7px;
  opacity: 0.4;
  height: 40px;
  min-width: 100px;
  max-width: 150px;

  &:focus {
    opacity: 1;
  }

  ::placeholder {
    font-size: 12px;
    color: grey;
  }
`;

export const RefreshContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0px;
`;

export const RefreshIcon = styled(FaSync)`
  cursor: pointer;
  color: lightgrey;
  font-size: 14px;
`;

export const RefreshLabel = styled.span`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.3s ease;
  color: lightgrey;
  font-size: 12px;

  ${RefreshContainer}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;
