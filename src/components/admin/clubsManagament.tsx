"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/admin/clubsManagement.module.css";
import {
  addClub,
  getAllClubs,
  updateStatusClubById,
} from "@/services/clubsService";
import {
  getAllAddClubForms,
  updateAddClubFormStatus,
} from "@/services/addClubServices";

import LoadingSpinner from "../Loading/LoadingSpinner";
import { addClubForm, Club, ClubStatus } from "@/types/ClubTypes";

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
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<any>(null);

  // Pagination states
  const [currentPageNewContacts, setCurrentPageNewContacts] = useState(1);
  const [currentPagePendingClubs, setCurrentPagePendingClubs] = useState(1);
  const [currentPageActiveClubs, setCurrentPageActiveClubs] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const addClubData: addClubForm[] = await getAllAddClubForms();
        setClubContacts(addClubData);
        const clubsData: Club[] = await getAllClubs();
        setAllClubs(clubsData);
        setPendingClubs(clubsData.filter((club) => club.clubStatus === "ממתין"));
        console.log("clubsData", clubsData);
        console.log("penddingClubData", pendingClubs);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const getPaginatedData = (data: any[], currentPage: number) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = (data: any[]) => Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (setPage: React.Dispatch<React.SetStateAction<number>>, page: number) => setPage(page);

  
  const handleFinalApproval = async (club: Club, status: string) => {
    try {
       await updateStatusClubById(club._id || " ", { clubStatus: status });
       const clubsData: Club[] = await getAllClubs();
       setAllClubs(clubsData);
       setPendingClubs(clubsData.filter((club) => club.clubStatus === "ממתין"));
        } catch (error) {
      console.error("Error approving club:", error);
    }
  };
  





  const openClubDetails = (club: addClubForm | Club) => {
    setSelectedClub({
      ...club,
      route: "route" in club ? club.route : undefined,
      clubRoute: "clubRoute" in club ? club.clubRoute : undefined,
    });
  };

  const closeClubDetails = () => {
    setSelectedClub(null);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      if (status === "אושר") {
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
          clubStatus: clubForSaving.route
            ? ClubStatus.pending
            : ClubStatus.active,
          email: clubForSaving.email || " ",
          createdAt: new Date(),
        };

        await addClub(newClub);
        if (newClub.clubStatus === ClubStatus.pending) {
          setPendingClubs((prev) => [...prev, newClub]);
        }
      }

      await updateAddClubFormStatus(id, status);

      setClubContacts((prevClubs) =>
        prevClubs.map((club) => (club._id === id ? { ...club, status } : club))
      );
    } catch (error) {
      console.error("Error updating club:", error);
    }
  };

  const handleDeactivateClub = async (id: string) => {
    try {
      await updateStatusClubById(id, { isActive: false, clubStatus: "בוטל" });
      setClubContacts((prev) =>
        prev.map((club) =>
          club._id === id
            ? { ...club, isActive: false, status: "בוטל" }
            : club
        )
      );
    } catch (error) {
      console.error("Error deactivating club:", error);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.mainTitle}>ניהול פניות למועדונים</p>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* NEW CLUB CONTACTS TABLE*/}
          <div className={styles.section}>
            <h2 className={styles.subTitle}>פניות חדשות</h2>
            {clubContacts.length === 0 ? (
              <p className={styles.noDataText}>אין פניות כרגע.</p>
            ) : (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>שם המועדון</th>
                      <th className={styles.tableHeader}>סטטוס</th>
                      <th className={styles.tableHeader}>API</th>
                      <th className={styles.tableHeader}>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedData(clubContacts, currentPageNewContacts).map(
                      (clubC) => (
                        <tr key={clubC._id} className={styles.tableRow}>
                          <td className={styles.tableCell}>{clubC.clubName}</td>
                          <td className={styles.tableCell}>{clubC.status}</td>
                          <td className={styles.tableCell}>
                            {clubC.route ? "כן" : "לא"}
                          </td>
                          <td className={styles.tableCellActions}>
                            {clubC.status === "התקבל" && (
                              <>
                                <button
                                  className={styles.detailsButton}
                                  onClick={() => openClubDetails(clubC)}
                                >
                                  פרטים
                                </button>
                                <button
                                  className={styles.approveButton}
                                  onClick={() =>
                                    handleUpdateStatus(clubC._id, "אושר")
                                  }
                                >
                                  אשר
                                </button>
                                <button
                                  className={styles.rejectButton}
                                  onClick={() =>
                                    handleUpdateStatus(clubC._id, "נדחה")
                                  }
                                >
                                  דחה
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  {Array.from({ length: totalPages(clubContacts) }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(setCurrentPageNewContacts, index + 1)}
                      className={`${styles.pageButton} ${
                        currentPageNewContacts === index + 1 ? styles.activePage : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* PENDING CLUBS TABLE */}
          <div className={styles.section}>
            <h2 className={styles.subTitle}>מועדונים ממתינים</h2>
            {pendingClubs.length === 0 ? (
              <p className={styles.noDataText}>אין מועדונים ממתינים.</p>
            ) : (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>שם המועדון</th>
                      <th className={styles.tableHeader}>סטטוס</th>
                      <th className={styles.tableHeader}>ניהול</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedData(pendingClubs, currentPagePendingClubs).map(
                      (club) => (
                        <tr key={club._id} className={styles.tableRow}>
                          <td className={styles.tableCell}>{club.clubName}</td>
                          <td className={styles.tableCell}>{club.clubStatus}</td>
                          <td className={styles.tableCellActions}>
                            <button
                              className={styles.detailsButton}
                              onClick={() => openClubDetails(club)}
                            >
                              פרטים
                            </button>
                            <button
                              className={styles.approveButton}
                              onClick={() => handleFinalApproval(club, "פעיל")}
                            >
                              אישור
                            </button>
                            <button
                          className={styles.rejectButton}
                          onClick={() => handleFinalApproval(club, "בוטל")}
                        >
                          מחיקה
                        </button>

                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  {Array.from({ length: totalPages(pendingClubs) }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(setCurrentPagePendingClubs, index + 1)}
                      className={`${styles.pageButton} ${
                        currentPagePendingClubs === index + 1 ? styles.activePage : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ACTIVE CLUBS TABLE*/}
          <div className={styles.section}>
            <h2 className={styles.subTitle}>מועדונים פעילים</h2>
            {allClubs.length===0 || allClubs.filter((club) => club.isActive && club.clubStatus === "פעיל").length === 0 ? (
              <p className={styles.noDataText}>אין מועדונים פעילים.</p>
            ) : (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>

                      <th className={styles.tableHeader}>שם המועדון</th>
                      <th className={styles.tableHeader}>סטטוס</th>
                      <th className={styles.tableHeader}>ניהול</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedData(
                      allClubs.filter((club) => club.isActive && club.clubStatus === "פעיל"),
                      currentPageActiveClubs
                    ).map((club) => (
                      <tr key={club._id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{club.clubName}</td>
                        <td className={styles.tableCell}>{club.clubStatus}</td>
                        <td className={styles.tableCellActions}>
                          <button
                            className={styles.detailsButton}
                            onClick={() => openClubDetails(club)}
                          >
                            פרטים
                          </button>
                          <button
                            className={styles.approveButton}
                            onClick={() => handleFinalApproval(club, "ממתין")}
                          >
                            השהה
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={() => handleDeactivateClub(club._id|| " ")}
                          >
                            בטל
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  {Array.from(
                    {
                      length: totalPages(
                        allClubs.filter((club) => club.isActive && club.clubStatus === "פעיל")
                      ),
                    },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(setCurrentPageActiveClubs, index + 1)}
                        className={`${styles.pageButton} ${
                          currentPageActiveClubs === index + 1 ? styles.activePage : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* CLUB DETAILS POPUP*/}
      {selectedClub && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>פרטי מועדון</h3>
            <p className={styles.popupText}>שם: {selectedClub.clubName}</p>
            <p className={styles.popupText}>לינק: {selectedClub.clubLink}</p>
            <p className={styles.popupText}>
              לוגו:
              <img
                src={selectedClub.clubLogo}
                alt="לוגו"
                className={styles.popupImage}
              />
            </p>
            <p className={styles.popupText}>
              נתיב: {selectedClub?.clubRoute || selectedClub?.route || "אין נתיב"}
            </p>
            <button
              className={styles.closePopupButton}
              onClick={closeClubDetails}
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubsContactsManagement;
