import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import {
    SearchContainer,
    SearchIcon,
    InputContainer,
    SupplierInput,
    SelectContainer,
    SelectLabel,
    Dropdown,
    DropdownOption,
    DateLabel,
    DateInput,
    SearchButton,
} from './SearchBenefits.Styles';


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
    ) => void;
}

const SearchBenefits: React.FC<SearchProps> = ({ clubs, categories, onSearch }) => {
    const [supplierFilter, setSupplierFilter] = useState("");
    const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [expirationStart, setExpirationStart] = useState<Date | null>(null);
    const [expirationEnd, setExpirationEnd] = useState<Date | null>(null);
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
        );
    };

    return (
        <SearchContainer>
            <InputContainer>
                <SupplierInput
                    type="text"
                    placeholder="חיפוש לפי שם העסק"
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

export default SearchBenefits;
