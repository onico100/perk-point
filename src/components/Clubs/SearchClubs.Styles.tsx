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
    left: 20px; 
    top: 50%;
    transform: translateY(-50%);
    color: grey;
`;

export const InputContainer = styled.div`
    position: relative;
    padding-left: 30px;
    width: 35%;
    
    &:focus-within ${SearchIcon} {
        color: black;
    }
`;
