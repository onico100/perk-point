"use client";

import React, { useState, useEffect } from "react";
import useGeneralStore from "@/stores/generalStore";
import { PreMode } from "@/types/types";
import styles from "@/styles/SignPages/TabSign.module.css";

interface TabProps {
  tabContent: React.ReactNode; 
}

const TabSign: React.FC<TabProps> = ({ tabContent }) => {
  const [activeTab, setActiveTab] = useState<string>("tab1");
  const { preMode, setPreMode } = useGeneralStore();

  useEffect(() => {
    if (preMode === PreMode.supplier) {setActiveTab("tab2"); } 
    else if (preMode === PreMode.user) {setActiveTab("tab1");}
  }, [preMode]);

  const onTabClick = (tab: string) => {
    if (tab === "tab1") setPreMode(PreMode.user);
    else if (tab === "tab2") setPreMode(PreMode.supplier);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabClick(tab);
  };

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeader}>
        <div
          onClick={() => handleTabClick("tab1")}
          className={`${styles.tab} ${activeTab === "tab1" ? styles.activeTab1 : styles.unableTab1}`}>
          {tabContent+" "}
           לקוח
        </div>
        <div
          onClick={() => handleTabClick("tab2")}
          className={`${styles.tab} ${activeTab === "tab2" ? styles.activeTab2 : styles.unableTab2}`}>
          {tabContent+" "}
           ספק
        </div>
      </div>
    </div>
  );
};

export default TabSign;
