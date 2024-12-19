"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupplierByCredentials } from "@/services/adminServices";
import styles from "@/styles/SignPages/AdminLogin.module.css";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const admin = await getSupplierByCredentials(email, password);
      if (admin) {
        localStorage.setItem("admin", JSON.stringify(admin));
        const setClientMode = useGeneralStore.getState().setClientMode;
        setClientMode(ClientMode.admin);
        router.push("/dashboard"); 
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
