"use client";
import React from "react";
import styles from "@/styles/about.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, PreMode } from "@/types/types";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const Contact = () => {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const { clientMode } = useGeneralStore();

  if (clientMode == ClientMode.connection) setClientMode(ClientMode.general);

  return (
    <div className={styles.aboutPage}>
      <div className={styles.contactUs}>
        <h2>צור קשר</h2>
        <li>
          <FaPhoneAlt /> 0599999999
        </li>
        <li>
          <IoIosMail /> perkpointsite@gmail.com
        </li>
      </div>
    </div>
  );
};

export default Contact;
