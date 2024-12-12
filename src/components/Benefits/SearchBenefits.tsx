import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import {
    SearchContainer,
    SearchIcon,
    InputContainer,
} from './SearchBenefits.Styles';
import {DropdownFilter, TextInputFilter, DateFilterComponent} from '@/components';

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
                <TextInputFilter
                    placeholder="חיפוש שם העסק"
                    value={searchFilters.supplierFilter}
                    onChange={(value) => updateSearchFilters("supplierFilter", value)}
                />
                <SearchIcon />
            </InputContainer>
            <DropdownFilter
                label="מועדונים"
                options={clubs?.map((club) => ({
                    id: club._id,
                    name: club.clubName,
                }))}
                selectedOptions={searchFilters.selectedClubs}
                onChange={(selected) => updateSearchFilters("selectedClubs", selected)}
            />
            <DropdownFilter
                label="קטגוריות"
                options={categories?.map((category) => ({
                    id: category._id,
                    name: category.categoryName,
                }))}
                selectedOptions={searchFilters.selectedCategories}
                onChange={(selected) => updateSearchFilters("selectedCategories", selected)}
            />
            <InputContainer>
                <TextInputFilter
                    placeholder="חיפוש לפי סניף"
                    value={searchFilters.branchFilter}
                    onChange={(value) => updateSearchFilters("branchFilter", value)}
                />
            </InputContainer>
            <DateFilterComponent
                startDate={searchFilters.expirationStart}
                endDate={searchFilters.expirationEnd}
                onStartDateChange={(date) => updateSearchFilters("expirationStart", date)}
                onEndDateChange={(date) => updateSearchFilters("expirationEnd", date)}
            />
        </SearchContainer>
    );
};

export default SearchBenefits;
