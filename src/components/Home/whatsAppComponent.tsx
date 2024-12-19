import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import styles from "@/styles/contact.module.css";

const WhatsAppContact: React.FC = () => {
  const phoneNumber = "972556738762";
  const message = "שלום, אני מעוניין ליצור קשר.";
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappButton}
    >
      <FaWhatsapp className={styles.whatsappIcon} />
      צור קשר בווצאפ
    </a>
  );
};

export default WhatsAppContact;
