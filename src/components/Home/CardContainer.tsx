import React from "react";
import Card from "./HomeCard";
import styles from "@/styles/Home/CardContainer.module.css";

const cardData = [
  {
    id: 1,
    image: "/clubs.png",
    title: " המועדונים שלנו",
    buttonText: "לכל המועדונים",
    buttonLink: "/clubs/0",
    marginTop: "0px", 
  },
  {
    id: 2,
    image: "https://cdn-icons-png.freepik.com/512/10074/10074811.png",
    title: " ההטבות שלנו",
    buttonText: "לכל הההטבות",
    buttonLink: "/benefits/0",
    marginTop: "40px", 
  },
  {
    id: 3,
    image: "https://cdn-icons-png.flaticon.com/512/4002/4002366.png",
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
