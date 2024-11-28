"use client";
import { useState } from "react";
import useGeneralStore from "@/stores/generalStore";
import { useLoginUser } from "@/hooks/useFetchUsers";
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
      alert("Please select a mode (User or Supplier).");
    }
  };

  return (
    <div className="login-page">
      <h1 className="text-center text-2xl font-bold">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
        >
          Login
        </button>

        <Link href={"/signup"}>חדש באתר? להרשמה</Link>
      </form>
    </div>
  );
}
