// components/Footer.tsx
import React from "react";
import styles from "@/styles/Home/Footer.module.css";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import logoLight from "@/assets/logoLight.png";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand/Info Section */}
        <div className={styles.brand}>
          <div className={styles.logoContainer}>
            <img
              src={logoLight.src}
              alt="Perk Point Logo"
              className={styles.logo}
            />
          </div>
          <p>&copy; {new Date().getFullYear()} Perk Point</p>
          <p>כל הזכויות שמורות.</p>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
          <div className={styles.linkColumn}>
            <h3>מפת האתר</h3>
            <ul>
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
          </div>
          <div className={styles.linkColumn}>
            <h3>מידע</h3>
            <ul>
              <li>
                <a href="/privacy">מדיניות פרטיות</a>
              </li>
              <li>
                <a href="/terms">תקנון האתר</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className={styles.socialMedia}>
          <h3>עקבו אחרינו</h3>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook">
              <FaFacebook className={styles.facebook} />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter className={styles.twitter} />
            </a>
            <a href="#" aria-label="Instagram">
              <FaSquareInstagram className={styles.instegram} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
