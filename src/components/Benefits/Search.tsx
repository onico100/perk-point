import React, { useState } from 'react';
import styles from '@/styles/Benefits/Search.module.css';


interface Club {
    _id: string;
    clubName: string;
}

interface SearchProps {
    clubs: Club[];
    onSearch: (supplierFilter: string, clubFilter: string, expirationRange: [Date | null, Date | null], keywordFilter: string) => void;
}

const Search: React.FC<SearchProps> = ({ clubs, onSearch }) => {
    const [supplierFilter, setSupplierFilter] = useState('');
    const [clubFilter, setClubFilter] = useState('');
    //
    const [expirationStart, setExpirationStart] = useState<Date | null>(null);
    const [expirationEnd, setExpirationEnd] = useState<Date | null>(null);
    const [keywordFilter, setKeywordFilter] = useState('');

    const handleSearch = () => {
        onSearch(supplierFilter, clubFilter, [expirationStart, expirationEnd], keywordFilter);
    };

    console.log(clubs)

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="חיפוש לפי עסק"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className={styles.supplierInput}
            />
            <select
                value={clubFilter}
                onChange={(e) => setClubFilter(e.target.value)}
                className={styles.clubSelect}
            >
                <option value="">בחירת מועדון</option>
                {clubs?.map((club) => (
                    <option key={club._id} value={club._id}>
                        {club.clubName}
                    </option>
                ))}
            </select>
            <label className={styles.dateLabel}>
                תוקף מ:
            </label>
            <input
                type="date"
                onChange={(e) => setExpirationStart(e.target.value ? new Date(e.target.value) : null)}
                className={styles.dateInput}
            />

            <label className={styles.dateLabel}>
                עד:
            </label>
            <input
                type="date"
                onChange={(e) => setExpirationEnd(e.target.value ? new Date(e.target.value) : null)}
                className={styles.dateInput}
            />
            <input
                type="text"
                placeholder="חיפוש לפי תיאור"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                className={styles.keywordInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
                חיפוש
            </button>
        </div>
    );
};

export default Search;