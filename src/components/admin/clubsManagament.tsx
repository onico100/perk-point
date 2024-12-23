"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/admin/clubsManagement.module.css";
import { addClub, getAllClubs , updateClubById, updateStatusClubById} from "@/services/clubsService";
import { getAllAddClubForms, updateAddClubFormStatus  } from "@/services/addClubServices";
import { addClubForm, Club, ClubStatus } from "@/types/types";
import LoadingSpinner from "../Loading/LoadingSpinner";

const AddClubForm: addClubForm = {
  clubName: "",
  clubLink: "",
  clubLogo: "",
  route: "",
  comments: "",
  email: "",
  isActive: true,
  status: "received",
  _id: "",
};

const ClubsContactsManagement = () => {
  const [clubContacts, setClubContacts] = useState([AddClubForm]);
  const [pendingClubs, setPendingClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<addClubForm | Club | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const addClubData: addClubForm[] = await getAllAddClubForms();
        setClubContacts(addClubData);
        setPendingClubs([])
        const pendingData: Club[] = await getAllClubs();
        setPendingClubs(pendingData.filter((club) => club.clubStatus === ClubStatus.pending));
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      if (status === "approved") {
        const clubForSaving = clubContacts.find((clubC) => clubC._id === id);

        if (!clubForSaving) {
          console.error("Club not found");
          return;
        }

        const newClub: Club = {
          clubName: clubForSaving.clubName || " ",
          clubLink: clubForSaving.clubLink || " ",
          clubLogo: clubForSaving.clubLogo || " ",
          clubRoute: clubForSaving.route || " ",
          APIData: !!clubForSaving.route,
          isActive: true,
          clubStatus: clubForSaving.route ? ClubStatus.pending : ClubStatus.active,
          email: clubForSaving.email || " ",
          createdAt: new Date(),
        };

        await addClub(newClub);
        setPendingClubs((prev) => [...prev, newClub]);
      }

      await updateAddClubFormStatus(id, status);

      setClubContacts((prevClubs) =>
        prevClubs.map((club) =>
          club._id === id ? { ...club, status } : club
        )
      );
    } catch (error) {
      console.error("Error updating club:", error);
    }
  };

  const handleFinalApproval = async (id: string , status: string) => {
    try {
      await updateStatusClubById(id, { clubStatus: status });
      setPendingClubs((prev) => prev.filter((club) => club._id !== id));
    } catch (error) {
      console.error("Error approving club:", error);
    }
  };



  const openClubDetails = (club: addClubForm | Club) => {
    setSelectedClub(club);
  };
  
  const closeClubDetails = () => {
    setSelectedClub(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>ניהול פניות למועדונים</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.section}>
            <h2 className={styles.subTitle}>פניות חדשות</h2>
            {clubContacts.length === 0 ? (
              <p className={styles.noDataText}>אין פניות כרגע.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>שם המועדון</th>
                    <th className={styles.tableHeader}>סטטוס</th>
                    <th className={styles.tableHeader}>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {clubContacts.map((clubC) => (
                    <tr key={clubC._id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{clubC.clubName}</td>
                      <td className={styles.tableCell}>{clubC.status}</td>
                      <td className={styles.tableCellActions}>
                        {clubC.status === "received" && (
                          <>
                            <button
                              className={styles.detailsButton}
                              onClick={() =>
                                openClubDetails(clubC)
                              }
                            >
                              פרטים
                            </button>
                            <button
                              className={styles.approveButton}
                              onClick={() =>
                                handleUpdateStatus(clubC._id, "approved")
                              }
                            >
                              אשר
                            </button>
                            <button
                              className={styles.rejectButton}
                              onClick={() =>
                                handleUpdateStatus(clubC._id, "rejected")
                              }
                            >
                              דחה
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
  
          <div className={styles.section}>
            <h2 className={styles.subTitle}>מועדונים ממתינים</h2>
            {pendingClubs.length === 0 ? (
              <p className={styles.noDataText}>אין מועדונים ממתינים.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>שם המועדון</th>
                    <th className={styles.tableHeader}>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingClubs.map((club: Club) => (
                    <tr key={club._id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{club.clubName}</td>
                      <td className={styles.tableCellActions}>
                        <button className={styles.detailsButton} onClick={() => openClubDetails(club)}>
                          פרטים
                        </button>
                        <button
                          className={styles.approveButton}
                          onClick={() => handleFinalApproval(club._id || " ", "ACTIVE")}
                        >
                          אישור וקליטת מועדון
                        </button>
                        <button
                          className={styles.rejectButton}
                          onClick={() => handleFinalApproval(club._id || " ", "REJECTED")}
                        >
                          מחיקת מועדון
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
  
        {selectedClub && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>פרטי מועדון</h3>
            <p className={styles.popupText}>שם: {selectedClub.clubName}</p>
            <p className={styles.popupText}>לינק: {selectedClub.clubLink}</p>
            <p className={styles.popupText}>לוגו: 
              <img 
                src={selectedClub.clubLogo} 
                alt="לוגו" 
                className={styles.popupImage} 
              />
            </p>
            <button className={styles.closePopupButton} onClick={closeClubDetails}>סגור</button>
          </div>
        </div>
      )}
c
    </div>
  );
  
};

export default ClubsContactsManagement;
