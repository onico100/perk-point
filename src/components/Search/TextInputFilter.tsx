import React from 'react';
import { SupplierInput, InputContainer } from '../Benefits/SearchBenefits.Styles';

interface TextInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

const TextInputFilter: React.FC<TextInputProps> = ({ placeholder, value, onChange }) => (
    <InputContainer>
        <SupplierInput
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </InputContainer>
);

export default TextInputFilter;
