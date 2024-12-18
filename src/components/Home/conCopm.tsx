"use client";
import React, { useState } from "react";
import styles from "@/styles/contact.module.css";
import { useRouter } from "next/navigation";
import SenddingAnimate from "@/components/Loading/SenddingAnimate";

interface ContactProps {
  isPopupOpen: boolean;
  setIsPopupOpen: (value: boolean) => void;
}

const Contact: React.FC<ContactProps> = ({ isPopupOpen, setIsPopupOpen }) => {
  const [formData, setFormData] = useState({ name: "", email: "", messageContent: "" });
  const [isLoading, setIsLoading] = useState(false); // מצב טעינה
  const [sent, setSent] = useState(false); // מצב הצלחה
  const [error, setError] = useState(""); // מצב שגיאה
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // התחלת טעינה

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setIsLoading(false); // סיום טעינה

      if (response.ok) {
        setSent(true);
        setFormData({ name: "", email: "", messageContent: "" });

        setTimeout(() => {
          setIsPopupOpen(false);
          setSent(false);
          router.push("/");
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || "Error sending message.");
      }
    } catch (err) {
      setIsLoading(false); // סיום טעינה גם במקרה של שגיאה
      setError("Error sending message.");
    }
  };

  return (
    isPopupOpen && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContent}>
          <span className={styles.popupClose} onClick={() => setIsPopupOpen(false)}>
            &times;
          </span>
          <h2 className={styles.popupTitle}>צור קשר</h2>
          {isLoading ? (<>
            <h2>ממש כמה רגעים..</h2>
            <SenddingAnimate /></>
          ) : !sent ? (
            // טופס לפני השליחה
            <form onSubmit={handleSubmit}>
              <div className={styles.emailName}>
                <div className={styles.emailNameIn}>
                  <label className={styles.popupLabel}>שם:</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.popupInput}
                    required
                  />
                </div>
                <div className={styles.emailNameIn}>
                  <label className={styles.popupLabel}>אימייל:</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.popupInput}
                    required
                  />
                </div>
              </div>
              <label className={styles.popupLabel}>הודעה:</label>
              <textarea
                name="messageContent"
                value={formData.messageContent}
                onChange={handleChange}
                className={styles.popupTextarea}
                required
              />
              <button type="submit" className={styles.popupButton}>
                שלח
              </button>
            </form>
          ) : (
            // הודעת הצלחה לאחר השליחה
            <p>ההודעה נשלחה בהצלחה!.</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    )
  );
};

export default Contact;
