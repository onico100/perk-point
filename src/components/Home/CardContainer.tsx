import React from "react";
import Card from "./HomeCard";
import styles from "@/styles/Home/CardContainer.module.css";

const cardData = [
  {
    id: 1,
    image:
      "https://lottie.host/eb8e0667-9262-4800-9065-2577240f378d/QpL5SdCN6D.lottie",
    title: " המועדונים שלנו",
    buttonText: "לכל המועדונים",
    buttonLink: "/clubs/0",
    marginTop: "0px",
  },
  {
    id: 2,
    image:
      "https://lottie.host/8bff526d-c6a3-4208-b193-8f287f2be9bc/azxkTdXG42.lottie",
    title: " ההטבות שלנו",
    buttonText: "לכל הההטבות",
    buttonLink: "/benefits/0",
    marginTop: "40px",
  },
  {
    id: 3,
    image:
      "https://lottie.host/ebf49ecb-6a76-4cfc-8d1d-a5bbd3d199c6/eqjFiyYtz1.lottie",
    title: " קצת עלינו",
    buttonText: "אודות",
    buttonLink: "/about",
    marginTop: "80px",
  },
];

const CardContainer: React.FC = () => {
  return (
    <div className={styles.cardContainer}>
      {cardData.map((card) => (
        <Card key={card.id} {...card} style={{ marginTop: card.marginTop }} />
      ))}
    </div>
  );
};

export default CardContainer;
