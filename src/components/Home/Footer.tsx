// components/Footer.tsx
import React from "react";
import styles from "@/styles/Home/Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <p>&copy; {new Date().getFullYear()} Perk Point</p>
          <p>כל הזכויות שמורות.</p>
        </div>
        <nav>
          <h2>מפת האתר</h2>
          <ul className={styles.navLinks}>
            <li>
              <a href="/">בית</a>
            </li>
            <li>
              <a href="/about">אודות</a>
            </li>
            <li>
              <a href="/contact">צור קשר</a>
            </li>
          </ul>
        </nav>
        <nav>
          <ul className={styles.navLinks}>
            <li>
              <a href="/privacy">מדינות פרטיות</a>
            </li>
            <li>
              <a href="/terms">תקנון האתר</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
