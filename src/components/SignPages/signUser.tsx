"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddUser } from "@/hooks/useFetchUsers";
import { userSchema, UserFormValues, User } from "@/types/types";
import styles from "@/styles/SignPages/sign.module.css";
import { checkEmailService } from "@/services/emailServices";
import { useState } from "react";
import { errorAlert } from "@/utils/sweet-alerts";
import { useRouter } from "next/navigation";

export default function SignUserComponent() {
  const { mutate: addUser, isPending } = useAddUser();
  const [emailExists, setEmailExists] = useState(false);
  const router = useRouter();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormValues) => {
    const emailExists = await checkEmailService(data.email);
    if (emailExists) {
      setEmailExists(true);
      errorAlert("Email already exists")
      return;
    }

    const userPayload: User = {
      ...data,
      clubs: [],
      registrationDate: new Date().toISOString(),
      savedBenefits: [],
      isActive: true,
    };

    addUser(userPayload, {
      onSuccess: (user) => {
        console.log("onSuccess user:", user);
      },
      onError: (error) => {
        console.error("Failed to add user:", error);
      },
    });
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="username">שם משתמש:</label>
          <input className={styles.inputField} id="username" {...register("username")} />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">אימייל:</label>
          <input className={styles.inputField} id="email" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">סיסמה:</label>
          <input className={styles.inputField} id="password" type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="city">עיר:</label>
          <input className={styles.inputField} id="city" {...register("city")} />
          {errors.city && <p>{errors.city.message}</p>}
        </div>

        {emailExists && (
          <div className="text-red-500 mb-4">
            <p>
              אימייל זה כבר קיים במערכת{" "}
              <br />
              <span
                className="text-red-500 underline cursor-pointer"
                onClick={() => router.push("/login-user")}
              >
                למעבר לדף התחברות
              </span>
            </p>
          </div>
        )}
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
