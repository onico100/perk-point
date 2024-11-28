"use client";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { useEffect } from "react";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral"
import { Benefit, Supplier, Club, Branch } from "@/types/types";
import styles from "@/styles/Benefits/BenefitDetais.module.css"
import { usePathname } from 'next/navigation';


const BenefitDetails = () => {
    const { benefits, isLoadingB, isFetchingB } = useFetchBenefits();
    const { suppliers, isLoadingS, isFetchingS } = useFetchSuppliers();
    const { clubs, isLoadingC, isFetchingC } = useFetchGeneral();


    if (isLoadingB || isFetchingB || isLoadingS || isFetchingS || isLoadingC || isFetchingC)
        return <div>Loading...</div>;

    const pathname = usePathname(); 
    const specificBenefitId = pathname.split('/')[3]; 



    const specificBenefit: Benefit | undefined = benefits?.find(benefit => benefit._id === specificBenefitId);
    const specificSupplier: Supplier | undefined = suppliers?.find(supplier => supplier._id === specificBenefit?.supplierId);
    const specificClub = clubs?.find((club: Club) => club._id === specificBenefit?.clubId);

    return (
        <div className={styles.container}>
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
                    <strong>תיאור:</strong> <br />{specificBenefit?.description}
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
                    {specificBenefit?.redemptionConditions}
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
