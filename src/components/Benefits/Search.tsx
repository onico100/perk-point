import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaChevronDown } from 'react-icons/fa';


const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 0;
`;

const InputContainer = styled.div`
    position: relative; 
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    margin-left: 15px;
    left: 10px; 
    top: 50%;
    transform: translateY(-50%);
    color: grey;
`;

const SupplierInput = styled.input`
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 7px;
    flex: 1;
    opacity: 0.4;
    width: 150px;
    max-width: 200px;
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

const ClubSelectContainer = styled.div`
    background-color: white;
    padding: 10px;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 7px;
    flex: 1;
    position: relative;
    opacity: 0.4;
    max-width: 200px;
    height: 40px; 

`;

const ClubSelectLabel = styled.label`
    display: flex; 
    cursor: pointer;
    padding: 5px;
    border-radius: 7px;
    align-items: center;
    height: 40px; 
    line-height: 40px; 
`;

const Dropdown = styled.div`
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

const ClubOption = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 0;
`;

const DateLabel = styled.label`
    margin-right: 8px;
    color: black; 
`;

const DateInput = styled.input`
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

const SearchButton = styled.button`
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


interface Club {
  _id: string;
  clubName: string;
}

interface SearchProps {
  clubs: Club[];
  onSearch: (
    supplierFilter: string,
    clubFilter: string[],
    expirationRange: [Date | null, Date | null],
    keywordFilter: string
  ) => void;
}

const Search: React.FC<SearchProps> = ({ clubs, onSearch }) => {
  const [supplierFilter, setSupplierFilter] = useState("");
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [expirationStart, setExpirationStart] = useState<Date | null>(null);
  const [expirationEnd, setExpirationEnd] = useState<Date | null>(null);
  const [keywordFilter, setKeywordFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCheckboxChange = (clubId: string) => {
    setSelectedClubs((prev) =>
      prev.includes(clubId)
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId]
    );
  };

  const handleSearch = () => {
    setDropdownOpen(false);
    onSearch(
      supplierFilter,
      selectedClubs,
      [expirationStart, expirationEnd],
      keywordFilter
    );
  };

    return (
        <SearchContainer>
            <InputContainer>
                <SupplierInput
                    type="text"
                    placeholder="חיפוש לפי עסק"
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                />
                <SearchIcon />
            </InputContainer>
            <ClubSelectContainer>
                <ClubSelectLabel onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {selectedClubs.length > 0
                        ? clubs.filter(club => selectedClubs.includes(club._id)).map(club => club.clubName).join(', ')
                        : 'בחר מועדונים'}
                    <FaChevronDown />
                </ClubSelectLabel>
                {dropdownOpen && (
                    <Dropdown>
                        {clubs.map((club) => (
                            <ClubOption key={club._id}>
                                <input
                                    type="checkbox"
                                    id={club._id}
                                    checked={selectedClubs.includes(club._id)}
                                    onChange={() => handleCheckboxChange(club._id)}
                                />
                                <label htmlFor={club._id}>{club.clubName}</label>
                            </ClubOption>
                        ))}
                    </Dropdown>
                )}
            </ClubSelectContainer>
            <DateLabel>תוקף מ:</DateLabel>
            <DateInput
                type="date"
                onChange={(e) => setExpirationStart(e.target.value ? new Date(e.target.value) : null)}
            />
            <DateLabel>עד:</DateLabel>
            <DateInput
                type="date"
                onChange={(e) => setExpirationEnd(e.target.value ? new Date(e.target.value) : null)}
            />
            <SearchButton onClick={handleSearch}>חיפוש</SearchButton>
        </SearchContainer>
    );
};

export default Search;
