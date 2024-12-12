import React from 'react';
import { DateLabel, DateInput } from '../Benefits/SearchBenefits.Styles';

interface DateFilterProps {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

const DateFilterComponent: React.FC<DateFilterProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}) => {
    const handleStartDateChange = (date: Date | null) => {
        if (date && endDate && date > endDate) {
            onStartDateChange(endDate);
        } else {
            onStartDateChange(date);
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date && startDate && date < startDate) {
            onEndDateChange(startDate);
        } else {
            onEndDateChange(date);
        }
    };

    return (
        <>
            <DateLabel>תוקף מ:</DateLabel>
            <DateInput
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ""}
                onChange={(e) =>
                    handleStartDateChange(e.target.value ? new Date(e.target.value) : null)
                }
            />
            <DateLabel>עד:</DateLabel>
            <DateInput
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ""}
                onChange={(e) =>
                    handleEndDateChange(e.target.value ? new Date(e.target.value) : null)
                }
            />
        </>
    );
};

export default DateFilterComponent;
