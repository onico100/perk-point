"use client";
import React from "react";
import TopBarButtons from "./TopBarButtons"; // Import the Buttons component
import Link from "next/link";
import logoLight from "@/assets/logoLight.png"
import linkStyle from "@/styles/Bars/Links.module.css";
import { usePathname } from "next/navigation";
import styles from '@/styles/Bars/TopBar.module.css';


const TopBar: React.FC = () => {
  const pathname = usePathname();
    return (
        <div className={styles.topBar}>
            <div className={styles.rightSide}>
                <img src={logoLight.src} alt="Perk Point Logo" className={styles.logo} />
                <Link className= {`${linkStyle.barItem}  ${pathname ===  "/benefits/0"? linkStyle.active : ''}`} href={"/benefits/0"}>הטבות</Link>
                <Link className= {`${linkStyle.barItem}  ${pathname ===  "/clubs/0"? linkStyle.active : ''}`} href={"/clubs/0"}>מועודנים</Link>
                <Link className={`${linkStyle.barItem}  ${pathname ===  "/about"? linkStyle.active : ''}`} href={"/about"}>אודות</Link>
            </div>
            <TopBarButtons />
        </div>
    );

};

export default TopBar;
 