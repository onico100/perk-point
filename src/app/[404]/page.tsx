"use client";

import Link from "next/link";
import styles from "@/styles/NotFound.module.css"; // Import the CSS module
import { RiEmotionSadLine } from "react-icons/ri";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <DotLottieReact
        src="https://lottie.host/35809e09-29db-409e-ae63-85425f78de81/25bCg796vh.lottie"
        loop
        autoplay
      />
      <div className={styles.con}>
        <h1 className={styles.title}>אופס...נראה שמה שחיפשת לא קיים</h1>
        <div className={styles.linkContainer}>
          <Link href="/" className={styles.link}>
            חזור לעמוד הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
