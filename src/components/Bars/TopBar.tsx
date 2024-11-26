"use client";
import React from "react";
import "@/styles/Bars/TopBar.css"; // Import styles
import TopBarButtons from "./TopBarButtons"; // Import the Buttons component

const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <img
        src="src\assets\logoLight.png"
        alt="Perk Point Logo"
        className="logo"
      />
      <TopBarButtons />
    </div>
  );
};

export default TopBar;
