"use client";
import { useState } from "react";
import useGeneralStore from "@/stores/generalStore";
import { useLoginUser } from "@/hooks/useFetchUsers";

import styles from "@/styles/login.module.css"; // Import the CSS module

import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";

import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const preMode = useGeneralStore((state) => state.preMode);
  const loginUserMutation = useLoginUser();
  const { loginSupplier } = useFetchSuppliers();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (preMode === "USER") {
      loginUserMutation.mutate(
        { email, password },
        {
          onSuccess: (user) => {
            alert(`Welcome, ${user.username}!`);
          },
          onError: (error) => {
            console.error(error);
            alert("Login failed: Invalid user credentials.");
          },
        }
      );
    } else if (preMode === "SUPPLIER") {
      loginSupplier(
        { email, password },
        {
          onSuccess: (supplier) => {
            alert(`Welcome, ${supplier.providerName}!`);
          },
          onError: (error) => {
            console.error(error);
            alert("Login failed: Invalid supplier credentials.");
          },
        }
      );
    } else {
      alert("No mode is selected (User or Supplier).");
    }
  };

  return (

    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.inlineContainer}>
          <p>איך לך עדיין משתמש?</p>
          <Link className={styles.link} href={"/signup"}>
            הירשם
          </Link>
        </div>
        <button type="submit">התחברות</button>

      </form>
    </div>
  );
}