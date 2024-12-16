'use client'
import React from 'react';
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { ClientMode } from "@/types/types";



interface ActionButtonsProps {
    isUpdateMode: boolean; 
    setIsUpdateMode: () => void; 
    handleSave: () => Promise<void>; 
    handleCancel: () => Promise<void>;
}


const ActionButtons: React.FC<ActionButtonsProps> = ({ isUpdateMode, setIsUpdateMode, handleSave, handleCancel }) => (
    <div className={styles.updateContainer}>
        {!isUpdateMode && (
            <button className={styles.updateButton} onClick={setIsUpdateMode}>
                עידכון
            </button>
        )}
        {isUpdateMode && (
            <div>
                <button className={styles.saveButton} onClick={handleSave}>שמירה</button>
                <button className={styles.cancelButton} onClick={handleCancel}>ביטול</button>
            </div>
        )}
    </div>
);

export default ActionButtons;