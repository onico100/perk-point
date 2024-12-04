import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';


export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 0;
    width: 100%;
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
    padding-left: 30px;
    width: 30%;
    
    &:focus-within ${SearchIcon} {
        color: black;
    }
`;

export const ClubInput = styled.input`
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 7px;
    flex: 1;
    opacity: 0.4;
    color: black;
    width: 100%;
    height: 40px; 

    &:focus {
        opacity: 1;
    }

    ::placeholder { 
        font-size: 12px;
        color: black;
    }
`;