import React from 'react';
import { SupplierInput } from '../Benefits/SearchBenefits.Styles';

interface TextInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

const TextInputFilter: React.FC<TextInputProps> = ({ placeholder, value, onChange }) => (
        <SupplierInput
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
);

export default TextInputFilter;
