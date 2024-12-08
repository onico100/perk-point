// import { signIn } from "next-auth/react";

// export default function LoginGoogleButton() {
//   const handleGoogleLogin = async () => {
//     const response = await signIn("google", { redirect: false });

//     if (response?.error) {
//       console.error("Google login failed:", response.error);
//     } else {
//       console.log("Google login successful!");
//       const { email, name } = response.user;

//       // שליחת נתונים ל-API
//       const res = await fetch("/api/auth/google", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, name }),
//       });

//       if (!res.ok) {
//         console.error("Failed to save user in MongoDB:", await res.json());
//       } else {
//         console.log("User saved successfully!");
//       }
//     }
//   };

//   return (
//     <button onClick={handleGoogleLogin} className="google-button">
//       התחברות עם Google
//     </button>
//   );
// }
