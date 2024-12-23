"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/clubManagement.module.css";
import LoadingSpinner from "../Loading/LoadingSpinner";
import {
  getAllAddClubForms,
  updateAddClubFormStatus,
  deleteAddClubFormById,
  getAddClubFormById,
} from "@/services/addClubServices";
import { addClubForm } from "@/types/types";

const ClubsContactManagement: React.FC = () => {
  const [clubs, setClubs] = useState<addClubForm[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedStatuses, setUpdatedStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true);
      try {
        const forms = await getAllAddClubForms();
        setClubs(forms);
      } catch (err) {
        setError("שגיאה בטעינת הפניות.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleAction = async (id: string, action: string) => {
    try {
      if (action === "approved") {
        await updateAddClubFormStatus(id, "approved");
      } else if (action === "rejected") {
        await updateAddClubFormStatus(id, "rejected");
      } else if (action === "deleted") {
        await deleteAddClubFormById(id);
      }

      setUpdatedStatuses((prev) => ({ ...prev, [id]: action }));
    } catch (err) {
      setError("שגיאה בעדכון הסטטוס.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>ניהול פניות מועדונים</h1>
      {isLoading && <LoadingSpinner />}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.clubList}>
  {clubs.map((club) => (
    <div
      key={club._id}
      className={`${styles.clubItem} ${
        updatedStatuses[club._id] ? styles[updatedStatuses[club._id]] : ""
      }`}
    >
      <h2 className={styles.clubTitle}>{club.clubName}</h2>
      <p className={styles.clubInfo}>
        <strong>לינק:</strong>{" "}
        <a href={club.clubLink} target="_blank" rel="noopener noreferrer">
          {club.clubLink}
        </a>
      </p>
      <p className={styles.clubInfo}>
        <strong>סטטוס:</strong> {club.status || "ממתין"}
      </p>
      <div className={styles.actionButtons}>
        <button
          className={`${styles.approveButton}`}
          onClick={() => handleAction(club._id, "approved")}
        >
          אשר
        </button>
        <button
          className={`${styles.rejectButton}`}
          onClick={() => handleAction(club._id, "rejected")}
        >
          דחה
        </button>
        <button
          className={`${styles.deleteButton}`}
          onClick={() => handleAction(club._id, "deleted")}
        >
          מחק
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default ClubsContactManagement;
