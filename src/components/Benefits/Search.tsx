import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaChevronDown } from 'react-icons/fa';


const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 0;
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    margin-left: 15px;
    left: 10px; 
    top: 50%;
    transform: translateY(-50%);
    color: grey;
`;

const InputContainer = styled.div`
    position: relative;
    
    &:focus-within ${SearchIcon} {
        color: black;
    }
`;

const SupplierInput = styled.input`
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

const SelectContainer = styled.div<{ isOpen: boolean }>`
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

const SelectLabel = styled.label`
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

const DropdownOption = styled.div`
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

interface Category {
    _id: string;
    categoryName: string;
}

interface SearchProps {
    clubs: Club[];
    categories: Category[];
    onSearch: (
        supplierFilter: string,
        clubFilter: string[],
        categoryFilter: string[],
        expirationRange: [Date | null, Date | null],
        keywordFilter: string
    ) => void;
}

const Search: React.FC<SearchProps> = ({ clubs, categories, onSearch }) => {
    const [supplierFilter, setSupplierFilter] = useState("");
    const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [expirationStart, setExpirationStart] = useState<Date | null>(null);
    const [expirationEnd, setExpirationEnd] = useState<Date | null>(null);
    const [keywordFilter, setKeywordFilter] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);


    const handleClubCheckboxChange = (clubId: string) => {
        setSelectedClubs((prev) =>
            prev.includes(clubId)
                ? prev.filter((id) => id !== clubId)
                : [...prev, clubId]
        );
    };

    const handleCategoryCheckboxChange = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSearch = () => {
        setDropdownOpen(false);
        setCategoryDropdownOpen(false);
        onSearch(
            supplierFilter,
            selectedClubs,
            selectedCategories,
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
            <SelectContainer isOpen={dropdownOpen}>
                <SelectLabel onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {selectedClubs.length > 0
                        ? `${selectedClubs.length} מועדונים`
                        : 'בחר מועדונים'}
                    <FaChevronDown />
                </SelectLabel>
                {dropdownOpen && (
                    <Dropdown>
                        {clubs.map((club) => (
                            <DropdownOption key={club._id}>
                                <input
                                    type="checkbox"
                                    id={club._id}
                                    checked={selectedClubs.includes(club._id)}
                                    onChange={() => handleClubCheckboxChange(club._id)}
                                />
                                <label htmlFor={club._id}>{club.clubName}</label>
                            </DropdownOption>
                        ))}
                    </Dropdown>
                )}
            </SelectContainer>
            <SelectContainer isOpen={categoryDropdownOpen}>
                <SelectLabel onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}>
                    {selectedCategories.length > 0
                        ? `${selectedCategories.length} קטגוריות`
                        : 'בחר קטגוריות'}
                    <FaChevronDown />
                </SelectLabel>
                {categoryDropdownOpen && (
                    <Dropdown>
                        {categories?.map((category) => (
                            <DropdownOption key={category._id}>
                                <input
                                    type="checkbox"
                                    id={category._id}
                                    checked={selectedCategories.includes(category._id)}
                                    onChange={() => handleCategoryCheckboxChange(category._id)}
                                />
                                <label htmlFor={category._id}>{category.categoryName}</label>
                            </DropdownOption>
                        ))}
                    </Dropdown>
                )}
            </SelectContainer>
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
