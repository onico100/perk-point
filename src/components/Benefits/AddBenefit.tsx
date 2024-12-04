"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "@/styles/Benefits/AddBenefit.module.css";
import { Benefit, Club } from "@/types/types";
import { useParams } from "next/navigation";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";

const formSchema = z.object({
  redemptionConditions: z
    .string()
    .min(2, "הגבלות ההטבה חייבות לכלול לפחות 2 תווים"),
  description: z.string().min(2, "תיאור ההטבה חייבות לכלול לפחות 2 תווים"),
  expirationDate: z
    .string()
    .min(1, "תאריך הוא שדה חובה")
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
      },
      { message: "תאריך חייב להיות בהווה או בעתיד" }
    ),
  clubId: z.string().min(1, "נא לבחור מועדון"),
});

export default function AddBenefit() {
 const {currentSupplier}=useGeneralStore()
  const id = currentSupplier?._id;

  const { clubs } = useFetchGeneral();
  const { addBenefit } = useFetchBenefits();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {

    console.log(data);
    const newBenefit = {
      supplierId: id,
      clubId: data.clubId, 
      redemptionConditions: data.redemptionConditions,
      description: data.description,
      expirationDate: new Date(data.expirationDate),
      branches: [],
      isActive: true,
   } as Benefit;
   console.log(newBenefit);
   console.log("sId: " + id)

    addBenefit(newBenefit);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>הוספת הטבה חדשה</h2>

      <div className={styles.inputContainer}>
        <label htmlFor="redemptionConditions" className={styles.label}>
          הגבלות ההטבה
        </label>
        <input
          id="redemptionConditions"
          type="text"
          placeholder="הזן את הגבלות ההטבה"
          className={styles.input}
          {...register("redemptionConditions")}
        />
        {errors.redemptionConditions && (
          <span className={styles.error}>
            {errors.redemptionConditions.message as string}
          </span>
        )}
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="description" className={styles.label}>
          תיאור ההטבה
        </label>
        <input
          id="description"
          type="text"
          placeholder="הזן תיאור ההטבה"
          className={styles.input}
          {...register("description")}
        />
        {errors.description && (
          <span className={styles.error}>
            {errors.description.message as string}
          </span>
        )}
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="expirationDate" className={styles.label}>
          תאריך תפוגה
        </label>
        <input
          id="expirationDate"
          type="date"
          className={styles.input}
          {...register("expirationDate")}
        />
        {errors.expirationDate && (
          <span className={styles.error}>
            {errors.expirationDate.message as string}
          </span>
        )}
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="clubId" className={styles.label}>
          מועדון
        </label>
        <select id="clubId" className={styles.select} {...register("clubId")}>
          <option value="">בחר מועדון</option>
          {clubs?.map((club: Club) => (
            <option key={club._id} value={club._id}>
              {club.clubName}
            </option>
          ))}
        </select>
        {errors.clubId && (
          <span className={styles.error}>
            {errors.clubId.message as string}
          </span>
        )}
      </div>
      <button type="submit" className={styles.submitButton}>
        הוסף הטבה
      </button>
    </form>
  );
}
