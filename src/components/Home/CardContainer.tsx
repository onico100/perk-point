import React from "react";
import Card from "./Card";
import styles from "@/styles/Home/CardContainer.module.css";

const cardData = [
  {
    id: 1,
    image: "/clubs.png",
    title: " המועדונים שלנו",
    buttonText: "לכל המועודנים",
    buttonLink: "/clubs/0",
    marginTop: "0px", // No offset for the first card
  },
  {
    id: 2,
    image: "https://cdn-icons-png.freepik.com/512/10074/10074811.png",
    title: " ההטבות שלנו",
    buttonText: "לכל הההטבות",
    buttonLink: "/benefits/0",
    marginTop: "40px", // Offset by 50px for the second card
  },
  {
    id: 3,
    image:
      "https://png.pngtree.com/png-clipart/20230802/original/pngtree-guide-information-color-icon-vector-picture-image_7821778.png",
    title: " קצת עלינו",
    buttonText: "אודות",
    buttonLink: "/about",
    marginTop: "80px", // Offset by 100px for the third card
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
