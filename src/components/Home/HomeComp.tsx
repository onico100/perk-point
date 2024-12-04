import React from "react";
import CardContainer from "./CardContainer";
import logotransperent from "@/assets/logotransperent.png";
import styles from "@/styles/Home/Home.module.css";

const HomeComp: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.logoContainer}>
        <img
          src={logotransperent.src}
          alt="Perk Point Logo"
          className={styles.image}
        />
        <p>כל ההטבות והמבצעים השווים במקום אחד!</p>
      </div>
      <CardContainer />
    </div>
  );
};

export default HomeComp;
