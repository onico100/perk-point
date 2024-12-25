import React from "react";
import Card from "./HomeCard";
import styles from "@/styles/Home/CardContainer.module.css";

const cardData = [
  {
    id: 1,
    image:
      "https://lottie.host/7e70f720-8456-4970-9b9f-ed1b27e21890/onF0AY0b7e.lottie",
    title: " המועדונים שלנו",
    buttonText: "לכל המועדונים",
    buttonLink: "/clubs/0",
    marginTop: "0px",
  },
  {
    id: 2,
    image:
      "https://lottie.host/80654365-46bd-4fa6-85b7-ecf7f08353d7/WJ1VYdrPsZ.lottie",
    title: " ההטבות שלנו",
    buttonText: "לכל הההטבות",
    buttonLink: "/benefits/0",
    marginTop: "40px",
  },
  {
    id: 3,
    image:
      "https://lottie.host/e3242acc-8290-47ee-b56a-1930c87df3d8/ldIU8uwf3K.lottie",
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
