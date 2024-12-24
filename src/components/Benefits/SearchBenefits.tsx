'use client'
import React, { useEffect, useState } from 'react';
import useFilterStore from "@/stores/filterStore";
import debounce from 'lodash.debounce';
import {
    SearchContainer,
    SearchIcon,
    InputContainer,
    RefreshContainer,
    RefreshLabel,
    RefreshIcon,

} from './SearchBenefits.Styles';
import { DropdownFilter, TextInputFilter, DateFilterComponent } from '@/components';
import { useParams } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";


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
    const { filtersMain, filtersPersenal, setFiltersMain, resetFiltersMain, resetFiltersPersenal, setFiltersPersenal } = useFilterStore();
    const params = useParams();
    const id = params.clientId;
    const typeFilter = id !== "0" ? "filtersPersenal" : "filtersMain";
    const filters = typeFilter === "filtersMain" ? filtersMain : filtersPersenal;
    const { currentUser } = useGeneralStore();
    const [isFocused, setIsFocused] = useState(false);

    const debouncedSearch =
        debounce(() => {
            onSearch(
                filters.supplierFilter,
                filters.selectedClubs,
                filters.selectedCategories,
                filters.branchFilter,
                [filters.expirationStart, filters.expirationEnd]
            );
        }, 300);


    useEffect(() => {
        debouncedSearch();
    }, [filtersMain, filtersPersenal]);
    
    const updateSearchFilters = (
        field: keyof typeof filtersMain,
        value: typeof filtersMain[keyof typeof filtersMain]
    ) => {
        if (typeFilter === "filtersMain") {
            setFiltersMain({ [field]: value });
        } else {
            setFiltersPersenal({ [field]: value });
        }
    };

    return (
        <SearchContainer>
            <InputContainer>
                <TextInputFilter
                    placeholder="חיפוש שם העסק"
                    value={filters.supplierFilter}
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
                selectedOptions={filters.selectedClubs}
                onChange={(selected) => updateSearchFilters("selectedClubs", selected)}
            />
            <DropdownFilter
                label="קטגוריות"
                options={categories?.map((category) => ({
                    id: category._id,
                    name: category.categoryName,
                }))}
                selectedOptions={filters.selectedCategories}
                onChange={(selected) =>
                    updateSearchFilters("selectedCategories", selected)
                }
            />
            <InputContainer>
                <TextInputFilter
                    placeholder="חיפוש לפי סניף"
                    value={filters.branchFilter}
                    onFocus={() => {
                        if (filters.branchFilter === '' && currentUser) {
                            updateSearchFilters("branchFilter", currentUser.city);  
                        }
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)} 
                    onChange={(value) => updateSearchFilters("branchFilter", value)}
                />
                <SearchIcon />
            </InputContainer>
            <DateFilterComponent
                startDate={filters.expirationStart}
                endDate={filters.expirationEnd}
                onStartDateChange={(date) => updateSearchFilters("expirationStart", date)}
                onEndDateChange={(date) => updateSearchFilters("expirationEnd", date)}
            />
            <RefreshContainer onClick={() => {
                if (typeFilter === "filtersMain") {
                    resetFiltersMain();
                } else {
                    resetFiltersPersenal();
                }
            }}>
                <RefreshIcon />
                <RefreshLabel>ריענון</RefreshLabel>
            </RefreshContainer>
        </SearchContainer>
    );
};

export default SearchBenefits;
