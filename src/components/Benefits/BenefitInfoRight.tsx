import React from 'react';
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { Benefit, Club } from "@/types/types";


interface BenefitInfoRightProps {
    updatedBenefit: Benefit | undefined;
    specificBenefit: Benefit | undefined;
    isUpdateMode: boolean;
    handleChange: (field: keyof Benefit, value: string) => void;
    specificClub: Club | undefined;
    handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, link: string) => void;
}


const BenefitInfoRight: React.FC<BenefitInfoRightProps> = ({
    updatedBenefit,
    specificBenefit,
    isUpdateMode,
    handleChange,
    specificClub,
    handleLinkClick,
}) => (
    <div className={styles.rightColumn}>
        <div className={styles.infoContainer}>
            <label htmlFor="description" className={styles.infoLabel}>תיאור ההטבה:</label>
            <textarea
                id="description"
                className={styles.infoBox}
                value={updatedBenefit?.description || ""}
                readOnly={!isUpdateMode}
                onChange={(e) => handleChange("description", e.target.value)}
            />
        </div>
        {specificClub && specificClub.clubLink ? (
            <a
                href={specificClub.clubLink}
                className={styles.button}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleLinkClick(e, specificClub.clubLink)}
            >
                מעבר להטבה: {specificClub.clubName}
            </a>
        ) : (
            <div>אין קישור למועדון</div>
        )}
        <div className={styles.infoContainer}>
            <label htmlFor="conditions" className={styles.infoLabel}>
                הגבלות:
            </label>
            <textarea
                id="conditions"
                className={styles.infoBox}
                value={updatedBenefit?.redemptionConditions || ""}
                readOnly={!isUpdateMode}
                onChange={(e) => handleChange("redemptionConditions", e.target.value)}
            />
            <label htmlFor="expirationDate" className={styles.infoLabel}>
                תוקף:
            </label>
            {isUpdateMode ? (
                <input
                    type="date"
                    className={styles.infoBox}
                    value={
                        updatedBenefit?.expirationDate
                            ? new Date(updatedBenefit.expirationDate)
                                .toISOString()
                                .split("T")[0]
                            : " "
                    }
                    onChange={(e) => handleChange("expirationDate", e.target.value)}
                />
            ) : specificBenefit?.expirationDate ? (
                new Date(specificBenefit.expirationDate).toLocaleDateString(
                    "he-IL",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }
                )
            ) : (
                "Not Available"
            )}
        </div>
    </div>
);

export default BenefitInfoRight;