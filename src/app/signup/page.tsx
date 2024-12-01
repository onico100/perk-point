"use client"
import { Login, SignSupllierComponent, TabSign} from "@/components/index";
import styles from "@/styles/login.module.css";

export default function SignUp(){

    return     <div className={styles.centerContainer}>
    <div className={styles.centerContent}>
      <TabSign tabContent="הרשמה" />
      <SignSupllierComponent />
    </div>
  </div>

}