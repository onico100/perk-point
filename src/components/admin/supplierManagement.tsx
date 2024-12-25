"use client";
import styles from "@/styles/admin/supplierManagement.module.css";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useState } from "react";
import { Modal, Button } from "antd";
import { Category } from "@/types/Generaltypes";
import { Supplier } from "@/types/SupplierTypes";

const SupplierManagement = () => {
  const { suppliers, deleteSupplier } = useFetchSuppliers();
  const { categories } = useFetchGeneral();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const showDetailsModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSupplier(null);
  };

  const handleDelete = (supplierId: string) => {
    deleteSupplier(supplierId);
  };

  const totalPages = Math.ceil((suppliers?.length || 0) / itemsPerPage);
  const currentSuppliers = suppliers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <h1>ניהול ספקים</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>לוגו</th>
            <th>שם העסק</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {currentSuppliers?.map((supplier) => (
            <tr key={supplier._id}>
              <td>
                <img
                  src={supplier.supplierLogo || "/default-logo.png"}
                  alt="Supplier Logo"
                  className={styles.logo}
                />
              </td>
              <td>{supplier.businessName}</td>
              <td>{supplier.email}</td>
              <td>{supplier.phoneNumber}</td>
              <td>
                <button
                  onClick={() => showDetailsModal(supplier)}
                  className={styles.detailsButton}
                >
                  פרטים
                </button>
                <button
                  onClick={() => handleDelete(supplier?._id || "unknown")}
                  className={styles.deleteButton}
                >
                  מחיקה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`${styles.pageButton} ${
              currentPage === index + 1 ? styles.activePage : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Modal
        title="פרטי ספק"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={<Button onClick={handleCancel}>סגירה</Button>}
      >
        {selectedSupplier && (
          <div className={styles.modalContent}>
            <p>
              <strong>שם העסק:</strong> {selectedSupplier.businessName}
            </p>
            <p>
              <strong>שם איש קשר:</strong> {selectedSupplier.providerName}
            </p>
            <p>
              <strong>כתובת אימייל:</strong> {selectedSupplier.email}
            </p>
            <p>
              <strong>טלפון:</strong> {selectedSupplier.phoneNumber}
            </p>
            <p>
              <strong>תאריך הרשמה:</strong>{" "}
              {selectedSupplier.registrationDate
                ? new Date(selectedSupplier.registrationDate).toLocaleString(
                    "en-US"
                  )
                : "Unknown"}
            </p>
            <p>
              <strong>קישור לאתר:</strong>{" "}
              <a
                href={selectedSupplier.siteLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedSupplier.siteLink}
              </a>
            </p>
            <p>
              <strong>קטגוריות משויכות:</strong>{" "}
              {selectedSupplier.selectedCategories
                ?.map(
                  (categoryId) =>
                    categories?.find(
                      (category: Category) => category._id === categoryId
                    )?.categoryName
                )
                .join(", ")}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupplierManagement;
