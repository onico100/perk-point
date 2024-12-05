"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddUser } from "@/hooks/useFetchUsers"; // הוסף את הוק יצירת המשתמש
import { userSchema, UserFormValues, User } from "@/types/types"; // צור סכמה חדשה ל-User
import styles from "@/styles/SignPages/sign.module.css";
import { checkEmailService } from "@/services/emailServices";
import { useState } from "react";

export default function SignUserComponent() {
  const { mutate: addUser, isPending } = useAddUser();
  const [emailExists, setEmailExists] = useState(false);

  //const setCurrentUser = useGeneralStore.getState().setCurrentUser;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit =async  (data: UserFormValues) => {
    const emailExists = await checkEmailService(data.email);
    if (emailExists) {
      setEmailExists(true);
      setError("email", { message: "אימייל זה כבר קייםר." });
      return;
    }

    console.log("data:", data);
    const userPayload: User = {
      ...data,
      clubs: [],
      registrationDate: new Date().toISOString(),
      savedBenefits: [],
      isActive: true,
    };

    console.log("userPayload:", userPayload);
    addUser(userPayload, {
      onSuccess: (user) => {
        console.log("onSuccess user:", user);
      },
      onError: (error) => {
        console.error("Failed to add user:", error);
        alert("Failed to add user.");
      },
    });
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        {/* Username */}
        <div className={styles.formGroup}>
          <label htmlFor="username">שם משתמש:</label>
          <input id="username" {...register("username")} />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">אימייל:</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
          {emailExists && <p className="text-red-500">אימייל זה כבר קיים</p>}
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label htmlFor="password">סיסמה:</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {/* City */}
        <div className={styles.formGroup}>
          <label htmlFor="city">עיר:</label>
          <input id="city" {...register("city")} />
          {errors.city && <p>{errors.city.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
          disabled={isPending}
        >
          {isPending ? "רושם משתמש..." : "הרשם"}
        </button>
      </form>
    </div>
  );
}
