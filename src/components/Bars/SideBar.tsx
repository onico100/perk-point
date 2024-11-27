'use client'
import React from 'react';
import useGeneralStore from '@/stores/generalStore'
import styles from '@/styles/Bars/SideBar.module.css';

const SideBar = () => {
    const { clientMode } = useGeneralStore();

    const userButtons = [
        "ההטבות שלי",
        "המועדונים שלי",
        "מועדפים",
        "פרטים אישיים"
    ];

    const supplierButtons = [
        "הטבות החברה",
        "פרטים אישיים"
    ];

    if (clientMode !== 'USER' && clientMode !== 'SUPPLIER') {
        return null; 
    }


    return (
        <div className={styles.sidebar}>
            {clientMode === 'USER' && userButtons.map((button, index) => (
                <div key={index} className={styles.sidebarItem}>
                    {button}
                </div>
            ))}
            {clientMode === 'SUPPLIER' && supplierButtons.map((button, index) => (
                <div key={index} className={styles.sidebarItem}>
                    {button}
                </div>
            ))}
        </div>
    );
};

export default SideBar;

