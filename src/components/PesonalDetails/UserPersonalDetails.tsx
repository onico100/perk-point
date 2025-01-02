"use client";
import styles from "@/styles/PersonalDetails/PersonalDetails.module.css";
import { User, userSchema } from "@/types/Generaltypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineModeEditOutline, MdOutlineEditOff } from "react-icons/md";
import {
  beforeActionAlert,
  errorAlert,
  successAlert,
} from "@/utils/sweet-alerts";
import { useUpdateUserById } from "@/hooks/useFetchUsers";

interface UserPersonalDetailsProps {
  currentUser: User;
}

export default function UserPersonalDetails({
  currentUser,
}: UserPersonalDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const { mutate: updateUser, error } = useUpdateUserById();

  const isExamle = currentUser.email == "userexample@try.com" ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues:{
      password:"00000000",
      username: currentUser?.username,
      email: currentUser?.email,
      city: currentUser?.city,
    }
  });

  const editUser = async (data: any) => {
    try {
      const alertConfirm = await beforeActionAlert("");
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
                successAlert("משתמש נערך בהצלחה!");
              },
              onError: (error) => {
                errorAlert("שגיאה בעריכת המשתמש");
              },
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
      {isExamle && editMode && (
        <h3>הנך במצב משתמש לדוגמא לכן לא תוכל לערוך שם או אימייל. </h3>
      )}
      <div className={styles.buttonsContainer}>
        <button
          type="button"
          className={styles.editButton}
          onClick={() => setEditMode(!editMode)}
        >
          {!editMode ? <MdOutlineModeEditOutline /> : <MdOutlineEditOff />}
        </button>
      </div>

      <p className={styles.item}>
        <span className={styles.label}>שם:</span>
        {!isExamle && editMode ? (
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
        {!isExamle && editMode ? (
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
      {editMode && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit(editUser)}
        >
          שמור
        </button>
      )}
    </div>
  );
}
