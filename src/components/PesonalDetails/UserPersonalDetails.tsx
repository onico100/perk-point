"use client";

import styles from "@/styles/PersonalDetails.module.css";
import { User } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CiEdit } from "react-icons/ci";
import {
  beforeActionAlert,
  errorAlert,
  inProccesAlert,
  successAlert,
} from "@/utils/sweet-alerts";
import { useUpdateUserById } from "@/hooks/useFetchUsers";

interface UserPersonalDetailsProps {
  currentUser: User;
}

const formSchema = z.object({
  username: z.string().min(3, "שם המשתמש חייב להיות לפחות 3 תווים."),
  email: z.string().email("כתובת אימייל אינה חוקית."),
  city: z.string().min(2, "יש להזין עיר."),
});

export default function UserPersonalDetails({currentUser,}: UserPersonalDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const { mutate: updateUser, error } = useUpdateUserById();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (editMode) {
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
      setValue("city", currentUser.city);
    }
  }, [editMode, currentUser, setValue]);

  const editUser = async (data: any) => {
    try {
      const alertConfirm = await beforeActionAlert("", "עריכה");
      if (alertConfirm) {
        if (currentUser?._id) {

          await updateUser(
            {
              id: currentUser._id,
              updatedData: {
                username: data?.username,
                email: data?.email,
                clubs: currentUser?.clubs,
                registrationDate: currentUser?.registrationDate,
                savedBenefits: currentUser?.savedBenefits,
                city: data?.city,
                isActive: currentUser?.isActive,
                password: currentUser?.password,
              },
            },
            {
              onSuccess: () => {
                successAlert("משתמש נערך ");
              },
              onError:(error) => {
                errorAlert("שגיאה בעריכת המשתמש");
              }
            }
          );
        }
      }
    } catch (err) {
      console.error("Error editing user:", err);
      errorAlert("שגיאה בעריכת המשתמש");
    } finally {
      setEditMode(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>פרטי משתמש</h2>
      <div className={styles.buttonsContainer}>
        {editMode && (
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit(editUser)}
          >
            שמור
          </button>
        )}
        <button
          type="button"
          className={styles.editButton}
          onClick={() => setEditMode(!editMode)}
        >
          <CiEdit />
        </button>
      </div>

      <p className={styles.item}>
        <span className={styles.label}>שם:</span>
        {editMode ? (
          <input
            id="username"
            {...register("username")}
            className={styles.input}
            defaultValue={currentUser?.username}
          />
        ) : (
          currentUser?.username
        )}
        {errors.username?.message && (
          <p className={styles.error}>{String(errors.username.message)}</p>
        )}
      </p>

      <p className={styles.item}>
        <span className={styles.label}>מייל:</span>
        {editMode ? (
          <input
            id="mail"
            type="email"
            defaultValue={currentUser?.email}
            {...register("email")}
            className={styles.input}
          />
        ) : (
          currentUser.email
        )}
        {errors.email?.message && (
          <p className={styles.error}>{String(errors.email.message)}</p>
        )}
      </p>

      <p className={styles.item}>
        <span className={styles.label}>עיר:</span>
        {editMode ? (
          <input
            id="city"
            {...register("city")}
            className={styles.input}
            defaultValue={currentUser?.city}
          />
        ) : (
          currentUser.city
        )}
        {errors.city?.message && (
          <p className={styles.error}>{String(errors.city.message)}</p>
        )}
      </p>

      <p className={styles.item}>
        <span className={styles.label}>תאריך הרשמה:</span>
        {new Date(currentUser.registrationDate).toLocaleDateString("he-IL")}
      </p>
    </div>
  );
}
