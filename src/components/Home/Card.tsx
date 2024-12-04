import React from "react";
import styles from "@/styles/Home/CardContainer.module.css";

interface CardProps {
  image: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  image,
  title,
  buttonText,
  buttonLink,
  style,
}) => {
  const gotoLink = () => {
    window.location.href = buttonLink;
  };
  return (
    <div className={styles.card} style={style}>
      <h2>{title}</h2>
      <img src={image} alt={title} />

      <button onClick={gotoLink}>{buttonText}</button>
    </div>
  );
};

export default Card;
