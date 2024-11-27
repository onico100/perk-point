import React from "react";
import useGeneralStore from '@/stores/generalStore';
import { ClientMode, PreMode } from '@/types/types';
import style from '@/styles/Bars/ModePopup.module.css'


const ModePopup: React.FC<{ onClose: () => void; anchorElement: HTMLElement | null }> = ({ onClose, anchorElement }) => {
    const setClientMode = useGeneralStore((state) => state.setClientMode);
    const setPreMode = useGeneralStore((state) => state.setPreMode);

    const handleSelect = (mode: string) => {
        setClientMode(ClientMode.connection);
        setPreMode(mode === ClientMode.user ? PreMode.user : PreMode.supplier);
        onClose();
    };

    if (!anchorElement)
        return null;

    const { bottom, left } = anchorElement.getBoundingClientRect();

    return (
        <div className={style.popup} 
        // style={{
        //     position: 'fixed', // Use fixed positioning
        //     top: bottom + window.scrollY + 10, // Position below the button
        //     left: left + window.scrollX // Align with the button
        // }}
        >
            <button onClick={() => handleSelect(ClientMode.user)}>לקוח</button>
            <button onClick={() => handleSelect(ClientMode.supplier)}>ספק</button>
        </div>
    );
};

export default ModePopup;


