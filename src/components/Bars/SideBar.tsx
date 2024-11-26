import React from 'react';
import useGeneralStore from '@/stores/generalStore'

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
        <div>
            {clientMode === 'USER' ? (
                userButtons.map((button, index) => (
                    <div key={index}>
                        {button}
                    </div>
                ))
            ) : (
                supplierButtons.map((button, index) => (
                    <div key={index}>
                        {button}
                    </div>
                ))
            )}
        </div>
    );
};

export default SideBar;