import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';


export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 0;
`;

export const SearchIcon = styled(FaSearch)`
    position: absolute;
    margin-left: 15px;
    left: 10px; 
    top: 50%;
    transform: translateY(-50%);
    color: grey;
`;

export const InputContainer = styled.div`
    position: relative;
    
    &:focus-within ${SearchIcon} {
        color: black;
    }
`;

export const SupplierInput = styled.input`
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 7px;
    flex: 1;
    opacity: 0.4;
    width: 200px;
    color: black;
    height: 40px; 

    &:focus {
        opacity: 1;
    }

    ::placeholder { 
        font-size: 12px;
        color: black;
    }
`;

export const SelectContainer = styled.div<{ isOpen: boolean }>`
    background-color: white;
    padding: 0;
    margin: 10px;
    border: 1.5px solid ${({ isOpen }) => (isOpen ? `white` : `transparent`)};
    border-radius: 7px;
    box-shadow: inset 0 0 0 2px ${({ isOpen }) => (isOpen ? `black` : `transparent`)};
    flex: 1;
    position: relative;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0.4)};
    max-width: 200px;
    height: 40px; 
    transition: opacity 0.3s; 
`;

export const SelectLabel = styled.label`
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    cursor: pointer;
    padding: 5px;
    border-radius: 7px;
    height: 40px; 
    line-height: 40px; 
    width: 100%;
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

export const DropdownOption = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 0;
`;

export const DateLabel = styled.label`
    margin-right: 8px;
    color: black; 
`;

export const DateInput = styled.input`
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 7px;
    opacity: 0.4;
    height: 40px; 

    &:focus {
        opacity: 1;
    }

    ::placeholder {
        font-size: 12px; 
        color: black; 
    }
`;

export const SearchButton = styled.button`
    padding: 10px 15px;
    position: absolute;
    margin-left: 15px;
    left:0%;
    background-color: white;
    color: black;
    opacity: 0.8;
    border: 1px solid #ccc;
    border-radius: 7px;
    cursor: pointer;
    height: 40px; 

    &:hover {
        opacity: 1;
    }
`;