import Link from "next/link";
import styles from "@/styles/NotFound.module.css"; // Import the CSS module
import { RiEmotionSadLine } from "react-icons/ri";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <RiEmotionSadLine className={styles.icon} />
      <h1 className={styles.title}>אופס...נראה שמה שחיפשת לא קיים</h1>
      <div className={styles.linkContainer}>
        <Link href="/" className={styles.link}>
          חזור לעמוד הבית
        </Link>
      </div>
    </div>
  );
}
