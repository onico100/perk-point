'use client'
import React from 'react';
import useGeneralStore from '@/stores/generalStore'
import styles from '@/styles/Bars/SideBar.module.css';

const SideBar = () => {
    const { clientMode } = useGeneralStore();

    const userButtons = [
        "הטבות שלי",
        "המועדונים שלי",
        "מועדפים",
        "פרטים אישים"
    ];

    const supplierButtons = [
        "הטבות החברה",
        "פרטים אישים"
    ];

    return (
        <div className={styles.sidebar}>
            {clientMode === 'USER' ? (
                userButtons.map((button, index) => (
                    <div key={index} className={styles.sidebarItem}>
                        {button}
                    </div>
                ))
            ) : (
                supplierButtons.map((button, index) => (
                    <div key={index} className={styles.sidebarItem}>
                        {button}
                    </div>
                ))
            )}
        </div>
    );
};

export default SideBar;