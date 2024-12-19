"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/dashboardContact.module.css";
import my_http from "@/services/http";
import { ContactForm } from "@/types/types";
import { getAllContactForms, updateContactFormStatus } from "@/services/contactServices";

const ContactManagement = () => {
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContactForms = async () => {
    try {
      const forms = await getAllContactForms();
      setContactForms(forms);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contact forms:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactForms();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateContactFormStatus(id, newStatus);
      setContactForms((prevForms) =>
        prevForms.map((form) =>
          form._id === id ? { ...form, status: newStatus } : form
        )
      );
    } catch (error) {
      console.error("Error updating contact form status:", error);
    }
  };

  if (loading) {
    return <p>טוען נתונים...</p>;
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "התקבלה":
        return styles.received;
      case "בטיפול":
        return styles.inProgress;
      case "טופלה":
        return styles.completed;
      case "בוטל":
        return styles.cancelled;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <h1> ניהול פניות</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>מספר פנייה</th>
            <th>שם</th>
            <th>אימייל</th>
            <th>תוכן ההודעה</th>
            <th>תאריך יצירה</th>
            <th>סטטוס פנייה</th>
          </tr>
        </thead>
        <tbody>
          {contactForms.map((form) => (
            <tr key={form._id}>
              <td>{form.serialNumber}</td>
              <td>{form.name}</td>
              <td>
                <a href={`mailto:${form.email}`} className={styles.emailLink}>
                  {form.email}
                </a>
              </td>
              <td>{form.messageContent}</td>
              <td>{new Date(form.createdAt).toLocaleString("he-IL")}</td>
              <td>
                <select
                  value={form.status}
                  onChange={(e) => handleStatusChange(form._id, e.target.value)}
                  className={`${styles.statusDropdown} ${getStatusClass(form.status)}`}
                >
                  <option value="התקבלה">התקבלה</option>
                  <option value="בטיפול">בטיפול</option>
                  <option value="טופלה">טופלה</option>
                  <option value="בוטל">בוטל</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactManagement;
