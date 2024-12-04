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
    const { benefits, isLoadingB, isFetchingB, updateBenefit } = useFetchBenefits();
    const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
    const { clubs, isLoadingC, isFetchingC } = useFetchGeneral();
    const clientMode = useGeneralStore(state => state.clientMode);
    const currentSupplier = useGeneralStore(state => state.currentSupplier);


    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [updatedBenefit, setUpdatedBenefit] = useState<Benefit | undefined>(undefined);

    const pathname = usePathname();
    const specificBenefitId = pathname.split('/')[3];

    const specificBenefit: Benefit | undefined = benefits?.find(benefit => benefit._id === specificBenefitId);
    const specificSupplier: Supplier | undefined = suppliers?.find(supplier => supplier._id === specificBenefit?.supplierId);
    const specificClub = clubs?.find((club: Club) => club._id === specificBenefit?.clubId);

    useEffect(() => {
        if (isUpdateMode) {
            setUpdatedBenefit(specificBenefit);
        } else {
            setUpdatedBenefit(specificBenefit);
        }
    }, [isUpdateMode, specificBenefit]);

    const handleSave = async () => {
        if (updatedBenefit) {
            try {
                await updateBenefit({
                    id: updatedBenefit._id,
                    updatedData: {
                        description: updatedBenefit.description,
                        redemptionConditions: updatedBenefit.redemptionConditions,
                        expirationDate: updatedBenefit.expirationDate,
                        branches: updatedBenefit.branches,
                        isActive: updatedBenefit.isActive,
                    },
                });
                console.log("Benefit updated successfully");
            } catch (error) {
                console.error("Error updating benefit:", error);
            }
        }
        setIsUpdateMode(false);
    };

    const handleChange = (field: keyof Benefit, value: string) => {
        if (updatedBenefit) {
            setUpdatedBenefit({
                ...updatedBenefit,
                [field]: field === 'expirationDate' ? new Date(value) : value
            });
        }
    };

    if (isLoadingB || isFetchingB || isLoadingS || isFetchingS || isLoadingC || isFetchingC)
        return <div>Loading...</div>;

    const isCurrentSupplierBenefit = currentSupplier && specificSupplier && currentSupplier._id === specificSupplier._id;

    return (
        <div className={styles.container}>
            {clientMode === ClientMode.supplier && isCurrentSupplierBenefit && !isUpdateMode && (
                <div className={styles.updateButtons}>
                    <button className={styles.updateButton} onClick={() => setIsUpdateMode(true)}>עידכון</button>
                </div>
            )}
            {isUpdateMode && (
                <div className={styles.updateButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>שמירה</button>
                    <button className={styles.cancelButton} onClick={() => setIsUpdateMode(false)}>ביטול</button>
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
                                    {branch.city}, {branch.nameBranch}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>כול הסניפים</div>
                    )}
                </div>
                <div className={styles.gridItem}>
                    <strong>תוקף:</strong><br />
                    {isUpdateMode ? (
                        <input
                            type="date"
                            value ={updatedBenefit?.expirationDate ? new Date(updatedBenefit.expirationDate).toISOString().split('T')[0] : ' '}
                            onChange={(e) => handleChange('expirationDate', e.target.value)}
                        />
                    ) : (
                        specificBenefit?.expirationDate ?
                            new Date(specificBenefit.expirationDate).toLocaleDateString('he-IL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'Not Available'
                    )}
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