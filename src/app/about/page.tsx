import React from "react";
import styles from "@/styles/about.module.css";

const About = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutUs}>
            <h2>אודותינו</h2>
            <p>
              כאן תוכל לגלות, לנהל ולהנות מכל ההטבות שמגיעות לך מכל מועדוני
              הלקוחות שלך במקום אחד נוח ונגיש.
            </p>
            <p>
              חפש הטבות לפי עסקים, שמור את ההטבות המועדפות עליך, וגלה שאחרי
              הסיפוקים בקלות.
            </p>
            <p>- PerkPoint - מציע לך יותר!</p>
          </div>
          <div className={styles.contactUs}>
            <h2>צור קשר</h2>
            <p>055-999-99999 📞</p>
            <p>fakeSite@perk.com 📧</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
