"use client";
import React from "react";
import "@/styles/Bars/TopBar.css"; // Import styles
import TopBarButtons from "./TopBarButtons"; // Import the Buttons component
import Link from "next/link";
import logoLight from "@/assets/logoLight.png";

const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div className="right-side">
        <img src={logoLight.src} alt="Perk Point Logo" className="logo" />
        <Link href={"/benefits/0"}>הטבות</Link>
        <Link href={"/clubs/0"}>מועודנים</Link>
        <Link href={"/about"}>אודות</Link>
      </div>
      <TopBarButtons />
    </div>
  );
};

export default TopBar;
