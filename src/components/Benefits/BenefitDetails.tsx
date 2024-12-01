"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { useEffect, useState } from "react";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { Benefit, Supplier, Club, ClientMode, Branch } from "@/types/types"; 
import styles from "@/styles/Benefits/BenefitDetais.module.css";
import { usePathname } from 'next/navigation';
import useGeneralStore from "@/stores/generalStore"; 

const BenefitDetails = () => {
    const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
    const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
    const { clubs, isLoadingC, isFetchingC } = useFetchGeneral();
    const clientMode = useGeneralStore(state => state.clientMode);

    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [updatedBenefit, setUpdatedBenefit] = useState<Benefit | undefined>(undefined);

    if (isLoadingB || isFetchingB || isLoadingS || isFetchingS || isLoadingC || isFetchingC)
        return <div>Loading...</div>;

    const pathname = usePathname();
    const specificBenefitId = pathname.split('/')[3];

    const specificBenefit: Benefit | undefined = benefits?.find(benefit => benefit._id === specificBenefitId);
    const specificSupplier: Supplier | undefined = suppliers?.find(supplier => supplier._id === specificBenefit?.supplierId);
    const specificClub = clubs?.find((club: Club) => club._id === specificBenefit?.clubId);

    useEffect(() => {
        if (isUpdateMode) {
            setUpdatedBenefit(specificBenefit);
        }
    }, [isUpdateMode, specificBenefit]);

    const handleSave = () => {
        console.log("Saving updated benefit...", updatedBenefit);
        // Add your saving logic here
        setIsUpdateMode(false); // Exit update mode after saving
    };

    const handleChange = (field: keyof Benefit, value: string) => {
        if (updatedBenefit) {
            setUpdatedBenefit({ ...updatedBenefit, [field]: value });
        }
    };

    return (
        <div className={styles.container}>
            {clientMode === ClientMode.supplier && !isUpdateMode && (
                <button className={styles.updateButton} onClick={() => setIsUpdateMode(true)}>עידכון</button>
            )}
            {isUpdateMode && (
                <div className={styles.updateButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>Save</button>
                    <button className={styles.cancelButton} onClick={() => setIsUpdateMode(false)}>Cancel</button>
                </div>
            )}
            <h1 className={styles.title}>פרטי ההטבה</h1>
            <div className={styles.supplierLogo}>
                {specificSupplier && specificSupplier.supplierLogo ? (
                    <img
                        src={specificSupplier.supplierLogo}
                        alt={`${specificSupplier.providerName} logo`}
                        className={styles.logo}
                    />
                ) : (
                    <div>No logo available.</div>
                )}
            </div>
            <div className={styles.grid}>
                <div className={styles.gridItem}>
                    <strong>תיאור:</strong> <br />
                    {isUpdateMode ? (
                        <textarea 
                            value={updatedBenefit?.description} 
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    ) : (
                        specificBenefit?.description
                    )}
                </div>
                <div className={styles.gridItem}>
                    <strong>מועדון:</strong><br />
                    {specificClub ? specificClub.clubName : 'Not Available'}
                </div>
                <div className={styles.gridItem}>
                    <strong>סניפים:</strong><br />
                    {specificBenefit?.branches && specificBenefit.branches.length > 0 ? (
                        <ul>
                            {specificBenefit.branches.map((branch, index) => (
                                <li key={index}>
                                    {branch.city}, {branch.address}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No branches available.</div>
                    )}
                </div>
                <div className={styles.gridItem}>
                    <strong>תוקף:</strong><br />
                    {specificBenefit?.expirationDate ?
                        new Date(specificBenefit.expirationDate).toLocaleDateString('he-IL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        : 'Not Available'}
                </div>
                <div className={styles.gridItem}>
                    <strong>הגבלות:</strong><br />
                    {isUpdateMode ? (
                        <textarea 
                            value={updatedBenefit?.redemptionConditions} 
                            onChange={(e) => handleChange('redemptionConditions', e.target.value)}
                        />
                    ) : (
                        specificBenefit?.redemptionConditions
                    )}
                </div>
                <div className={styles.gridItem}>
                    <div className={styles.gridItem}>
                        {specificClub && specificClub.clubLink ? (
                            <div className={styles.businessLink}>
                                <a
                                    href={specificClub.clubLink}
                                    className={styles.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    למעבר לבית העסק
                                </a>
                            </div>
                        ) : (
                            <div>Link Not Available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenefitDetails;