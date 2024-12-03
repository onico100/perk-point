import React, { useState } from 'react';
import styles from '@/styles/Benefits/Search.module.css';
import { FaSearch } from 'react-icons/fa';



interface Club {
    _id: string;
    clubName: string;
}

interface SearchProps {
    clubs: Club[];
    onSearch: (supplierFilter: string, clubFilter: string[], expirationRange: [Date | null, Date | null], keywordFilter: string) => void;
}

const Search: React.FC<SearchProps> = ({ clubs, onSearch }) => {
    const [supplierFilter, setSupplierFilter] = useState('');
    const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
    const [expirationStart, setExpirationStart] = useState<Date | null>(null);
    const [expirationEnd, setExpirationEnd] = useState<Date | null>(null);
    const [keywordFilter, setKeywordFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false); 

    const handleCheckboxChange = (clubId: string) => {
        setSelectedClubs((prev) =>
            prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId]
        );
    };

    const handleSearch = () => {
        onSearch(supplierFilter, selectedClubs, [expirationStart, expirationEnd], keywordFilter);
    };

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="חיפוש לפי עסק"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className={styles.supplierInput}
            />
            <div className={styles.clubSelectContainer}>
                <label onClick={() => { setDropdownOpen(!dropdownOpen); }} className={`${styles.clubSelectLabel} ${dropdownOpen ? styles.dropdownOpen : ''}`}>
                    {selectedClubs.length > 0 ? `בחר מועדונים: ${clubs.filter(club => selectedClubs.includes(club._id)).map(club => club.clubName).join(', ')}` 
                    : 'בחר מועדונים'}
                    <span className={styles.triangle}></span> 
                </label>
                {dropdownOpen && (
                    <div className={styles.dropdown}>
                        {clubs.map((club) => (
                            <div key={club._id} className={styles.clubOption}>
                                <input
                                    type="checkbox"
                                    id={club._id}
                                    checked={selectedClubs.includes(club._id)}
                                    onChange={() => handleCheckboxChange(club._id)}
                                />
                                <label htmlFor={club._id}>{club.clubName}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
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
            <button onClick={handleSearch} className={styles.searchButton}>
                <FaSearch size={20} /> 
            </button>
        </div>
    );
};

export default Search;