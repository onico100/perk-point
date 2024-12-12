import React, { useState, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { SelectContainer, SelectLabel, Dropdown, DropdownOption } from '../Benefits/SearchBenefits.Styles';

interface DropdownFilterProps {
    label: string;
    options: { id: string; name: string }[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ label, options, selectedOptions, onChange }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleSelection = (id: string) => {
        const isSelected = selectedOptions.includes(id);
        const newSelection = isSelected
            ? selectedOptions.filter((selected) => selected !== id)
            : [...selectedOptions, id];
        onChange(newSelection);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
            setDropdownOpen(false);
        }
    };

    return (
        <SelectContainer
            ref={dropdownRef}
            $isOpen={dropdownOpen}
            tabIndex={0} 
            onBlur={handleBlur}
        >
            <SelectLabel onClick={() => setDropdownOpen(!dropdownOpen)}>
                {selectedOptions.length > 0 ? `${selectedOptions.length} ${label}` : `בחר ${label}`}
                <FaChevronDown />
            </SelectLabel>
            {dropdownOpen && (
                <Dropdown>
                    {options?.map(({ id, name }) => (
                        <DropdownOption key={id}>
                            <input
                                type="checkbox"
                                id={id}
                                checked={selectedOptions.includes(id)}
                                onChange={() => toggleSelection(id)}
                            />
                            <label htmlFor={id}>{name}</label>
                        </DropdownOption>
                    ))}
                </Dropdown>
            )}
        </SelectContainer>
    );
};

export default DropdownFilter;

