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

const SupplierBranches: React.FC<SupplierBranchesProps> = ({
  currentSupplier,
}) => {
  const [assignedBranches, setAssignedBranches] = useState<Branch[]>([]);
  const [googleSuggestions, setGoogleSuggestions] = useState<Branch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  const { updateSupplier } = useFetchSuppliers();

  useEffect(() => {
    if (currentSupplier?.branches) {
      setAssignedBranches(currentSupplier.branches);
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

  const removeBranch = (branchName: string) => {
    setSelectedBranches((prev) =>
      prev.filter((branch) => branch.nameBranch !== branchName)
    );
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

      <h3>סניפים משויכים</h3>
      <ul className={styles.branchList}>
        {assignedBranches.map((branch) => (
          <li key={branch.nameBranch} className={styles.branchItem}>
            <span>
              {branch.nameBranch}, {branch.city}
            </span>
            <button
              className={styles.removeButton}
              onClick={() => removeBranch(branch.nameBranch)}
            >
              הסר
            </button>
          </li>
        ))}
      </ul>

      <h3>הצעות מגוגל</h3>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <ul className={styles.suggestions}>
          {googleSuggestions.map((suggestion) => (
            <li key={suggestion.nameBranch} className={styles.suggestionItem}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedBranches.some(
                    (b) => b.nameBranch === suggestion.nameBranch
                  )}
                  onChange={() => toggleGoogleSuggestion(suggestion)}
                />
                {suggestion.nameBranch}, {suggestion.city}
              </label>
            </li>
          ))}
        </ul>
      )}

      <button className={styles.saveButton} onClick={handleSaveChanges}>
        שמור שינויים
      </button>
    </div>
  );
};

export default SupplierBranches;
