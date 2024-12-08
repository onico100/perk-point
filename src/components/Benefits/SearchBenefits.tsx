import React, { useState, useCallback } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import debounce from 'lodash.debounce';
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
        branchFilter: string,
        expirationRange: [Date | null, Date | null],
    ) => void;
}

const SearchBenefits: React.FC<SearchProps> = ({ clubs, categories, onSearch }) => {
    const [searchFilters, setSearchFilters] = useState({
        supplierFilter: "",
        selectedClubs: [] as string[],
        selectedCategories: [] as string[],
        branchFilter: "",
        expirationStart: null as Date | null,
        expirationEnd: null as Date | null,
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    const debouncedSearch = useCallback(
        debounce((filters) => {
            onSearch(
                filters.supplierFilter,
                filters.selectedClubs,
                filters.selectedCategories,
                filters.branchFilter,
                [filters.expirationStart, filters.expirationEnd]
            );
        }, 300),
        [onSearch]
    );

    const updateSearchFilters = (field: keyof typeof searchFilters, value: any) => {
        debouncedSearch.cancel();
        
        setSearchFilters((prev) => {
            const newFilters = { ...prev, [field]: value };
            debouncedSearch(newFilters); 
            return newFilters;
        });
    };

    return (
        <SearchContainer>
            <InputContainer>
                <SupplierInput
                    type="text"
                    placeholder="חיפוש שם העסק"
                    value={searchFilters.supplierFilter}
                    onChange={(e) => updateSearchFilters("supplierFilter", e.target.value)}
                />
                <SearchIcon />
            </InputContainer>
            <SelectContainer $isOpen={dropdownOpen}>
                <SelectLabel onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {searchFilters.selectedClubs.length > 0
                        ? `${searchFilters.selectedClubs.length} מועדונים`
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
                                    checked={searchFilters.selectedClubs.includes(club._id)}
                                    onChange={(e) => updateSearchFilters("selectedClubs", searchFilters.selectedClubs.includes(club._id)
                                        ? searchFilters.selectedClubs.filter((id) => id !== club._id)
                                        : [...searchFilters.selectedClubs, club._id])}
                                />
                                <label htmlFor={club._id}>{club.clubName}</label>
                            </DropdownOption>
                        ))}
                    </Dropdown>
                )}
            </SelectContainer>
            <SelectContainer $isOpen={categoryDropdownOpen}>
                <SelectLabel onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}>
                    {searchFilters.selectedCategories.length > 0
                        ? `${searchFilters.selectedCategories.length} קטגוריות`
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
                                    checked={searchFilters.selectedCategories.includes(category._id)}
                                    onChange={(e) => updateSearchFilters(
                                        "selectedCategories",
                                        searchFilters.selectedCategories.includes(category._id)
                                            ? searchFilters.selectedCategories.filter((id) => id !== category._id)
                                            : [...searchFilters.selectedCategories, category._id]
                                    )}
                                />
                                <label htmlFor={category._id}>{category.categoryName}</label>
                            </DropdownOption>
                        ))}
                    </Dropdown>
                )}
            </SelectContainer>
            <InputContainer>
                <SupplierInput
                    type="text"
                    placeholder="חיפוש לפי סניף"
                    value={searchFilters.branchFilter}
                    onChange={(e) => updateSearchFilters("branchFilter", e.target.value)}
                />
                <SearchIcon />
            </InputContainer>
            <DateLabel>תוקף מ:</DateLabel>
            <DateInput
                type="date"
                value={searchFilters.expirationStart ? searchFilters.expirationStart.toISOString().split('T')[0] : ""}
                onChange={(e) =>
                    updateSearchFilters(
                        "expirationStart",
                        e.target.value ? new Date(e.target.value) : null
                    )
                }
            />
            <DateLabel>עד:</DateLabel>
            <DateInput
                type="date"
                value={searchFilters.expirationEnd ? searchFilters.expirationEnd.toISOString().split('T')[0] : ""}
                onChange={(e) =>
                    updateSearchFilters(
                        "expirationEnd",
                        e.target.value ? new Date(e.target.value) : null
                    )
                }
            />
        </SearchContainer>
    );
};

export default SearchBenefits;


