"use client";
import LoginUserComponent from "@/components/SignPages/loginUser";
import styles from "@/styles/SignPages/sign.module.css";
import { SessionProvider, useSession } from "next-auth/react";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const LoginUserContent = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className={styles.loading}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.centerContainer}>
      <div className={styles.centerContent}>
        <LoginUserComponent />
      </div>
    </div>
  );
};

const LoginUserPage = () => {
  return (
    <SessionProvider>
      <LoginUserContent />
    </SessionProvider>
  );
};

export default LoginUserPage;
