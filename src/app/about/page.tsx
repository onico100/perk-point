"use client";
import React from "react";
import styles from "@/styles/about.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode} from "@/types/types";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const About = () => {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const { clientMode } = useGeneralStore();

  if (clientMode == ClientMode.connection) setClientMode(ClientMode.general);

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
            <li>
              <FaPhoneAlt /> 0599999999
            </li>
            <li>
              <a href="mailto:PerkPointSite@gmail.com">
                <IoIosMail /> PerkPointSite@gmail.com
              </a>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
