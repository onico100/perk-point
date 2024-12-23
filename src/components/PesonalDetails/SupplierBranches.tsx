"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/PersonalDetails/supplierBranches.module.css";
import { Branch, Supplier } from "@/types/types";
import { getbranchesByBusinessName } from "@/services/branchesService";
import {
  successAlert,
  errorAlert,
  beforeActionAlert,
} from "@/utils/sweet-alerts";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";

interface SupplierBranchesProps {
  currentSupplier: Supplier;
}

const SupplierBranches: React.FC<SupplierBranchesProps> = ({ currentSupplier }) => {
  const [googleSuggestions, setGoogleSuggestions] = useState<Branch[]>([]); 
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]); 
  const [loading, setLoading] = useState(false);

  const { updateSupplier } = useFetchSuppliers();

  useEffect(() => {
    if (currentSupplier?.branches) {
      setSelectedBranches(currentSupplier.branches);
    }
    fetchGoogleSuggestions(currentSupplier.businessName || "");
  }, [currentSupplier]);

  const fetchGoogleSuggestions = async (businessName: string) => {
    if (!businessName) return;
    setLoading(true);
    try {
      const suggestions = await getbranchesByBusinessName(businessName);
      setGoogleSuggestions(suggestions);
    } catch (error) {
      errorAlert("שגיאה בטעינת סניפים מגוגל.");
    } finally {
      setLoading(false);
    }
  };
  

  const toggleGoogleSuggestion = (branch: Branch) => {
    const isSelected = selectedBranches.some(
      (b) => b.nameBranch === branch.nameBranch
    );
    if (isSelected) {
      setSelectedBranches((prev) =>
        prev.filter((b) => b.nameBranch !== branch.nameBranch)
      );
    } else {
      setSelectedBranches((prev) => [...prev, branch]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const confirm = await beforeActionAlert("האם לשמור את השינויים?");
      if (!confirm) return;
  
      const updatedSupplier = {
        ...currentSupplier,
        branches: selectedBranches,
      };
  
      await updateSupplier({
        id: currentSupplier._id || " ",
        updatedData: {
          providerName: updatedSupplier.providerName,
          password: updatedSupplier.password,
          email: updatedSupplier.email,
          businessName: updatedSupplier.businessName,
          categories: updatedSupplier.categories,
          phoneNumber: updatedSupplier.phoneNumber,
          registrationDate: updatedSupplier.registrationDate,
          branches: updatedSupplier.branches,
          siteLink: updatedSupplier.siteLink,
          supplierLogo: updatedSupplier.supplierLogo,
          isActive: updatedSupplier.isActive,
          selectedCategories: updatedSupplier.selectedCategories,
        },
      });

      const updatedSuggestions = googleSuggestions.filter(
        (suggestion) =>
          !selectedBranches.some(
            (branch) => branch.nameBranch === suggestion.nameBranch
          )
      );
      setGoogleSuggestions(updatedSuggestions);
  
      successAlert("השינויים נשמרו בהצלחה!");
    } catch (error) {
      errorAlert("שגיאה בשמירת השינויים.");
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        ניהול סניפים עבור {currentSupplier?.businessName}
      </h2>
      <h4>
        יש לבחור סניפים להוספה או להסרה
      </h4>

      {loading ? (
        <p>טוען...</p>
      ) : (
        <ul className={styles.suggestions}>
          {googleSuggestions.map((suggestion) => {
            return (
              <li key={suggestion.nameBranch} className={styles.suggestionItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedBranches.some(
                      (b) => b.nameBranch === suggestion.nameBranch
                    )}
                    onChange={() => toggleGoogleSuggestion(suggestion)}
                    className={styles.customCheckbox} 
                  />
                  <span className={styles.branchName}>
                    {suggestion.nameBranch}, {suggestion.city}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      <button className={styles.saveButton} onClick={handleSaveChanges}>
        שמור שינויים
      </button>
    </div>
  );
};

export default SupplierBranches;
