import React from 'react';
import { SupplierInput } from '../Benefits/SearchBenefits.Styles';

interface TextInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;  
    onBlur?: () => void; 
}

const TextInputFilter: React.FC<TextInputProps> = ({ placeholder, value, onChange, onFocus, onBlur }) => (
        <SupplierInput
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}  
            onBlur={onBlur}    
        />
);

export default TextInputFilter;
