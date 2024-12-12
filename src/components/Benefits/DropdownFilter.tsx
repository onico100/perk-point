import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { SelectContainer, SelectLabel, Dropdown, DropdownOption } from './SearchBenefits.Styles';

interface DropdownFilterProps {
    label: string;
    options: { id: string; name: string }[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ label, options, selectedOptions, onChange }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleSelection = (id: string) => {
        const isSelected = selectedOptions.includes(id);
        const newSelection = isSelected
            ? selectedOptions.filter((selected) => selected !== id)
            : [...selectedOptions, id];
        onChange(newSelection);
    };

    return (
        <SelectContainer $isOpen={dropdownOpen}>
            <SelectLabel onClick={() => setDropdownOpen(!dropdownOpen)}>
                {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : label}
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
