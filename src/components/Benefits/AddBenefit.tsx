"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "@/styles/Benefits/AddBenefit.module.css";
import { Benefit, Branch, Club } from "@/types/types";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  redemptionConditions: z
    .string()
    .min(2, "הגבלות ההטבה חייבות לכלול לפחות 2 תווים"),
  description: z.string().min(2, "תיאור ההטבה חייב לכלול לפחות 2 תווים"),
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
  club: z.string().min(1, "נא לבחור מועדון"),
  branches: z.array(z.string()).refine(
    (branches) => {
      return branches.length > 0;
    },
    { message: "נא לבחור לפחות סניף אחד" }
  ),
});

export default function AddBenefit() {

  const router = useRouter();
  const { currentSupplier } = useGeneralStore();
  const id = currentSupplier?._id;
  const [selectAll, setSelectAll] = useState(true);
  const branches = currentSupplier?.branches || [];

  const { clubs } = useFetchGeneral();
  const { addBenefit } = useFetchBenefits();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setValue("branches", selectAll ? branches.map((b) => b.nameBranch) : []);
  }, [selectAll, branches, setValue]);

  const onSubmit = (data: any) => {
    const selectedBranches = selectAll
      ? branches
      : branches.filter((b) => data.branches.includes(b.nameBranch));
    
      const newBenefit = {
      supplierId: id,
      clubId: data.club,
      redemptionConditions: data.redemptionConditions,
      description: data.description,
      expirationDate: new Date(data.expirationDate),
      branches: selectedBranches,
      isActive: true,
    } as Benefit;
    
    addBenefit(newBenefit);
    router.push(`/benefits/${id}`);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>הוספת הטבה חדשה</h2>

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
        <select id="club" className={styles.select} {...register("club")}>
          <option value="">בחר מועדון</option>
          {clubs?.map((club: Club) => (
            <option key={club._id} value={club._id}>
              {club.clubName}
            </option>
          ))}
        </select>
        {errors.club && (
          <span className={styles.error}>{errors.club.message as string}</span>
        )}
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.label}>סניפים</label>
        <div>
          <label>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={() => setSelectAll(!selectAll)}
            />
            כל הסניפים
          </label>
        </div>

        {!selectAll && (
          <div className={styles.branchList}>
            {branches.map((b: Branch) => (
              <label key={b.nameBranch} className={styles.branchLabel}>
                <input
                  type="checkbox"
                  value={b.nameBranch}
                  {...register("branches")}
                />
                {b.nameBranch}, {b.city}
              </label>
            ))}
          </div>
        )}

        {errors.branches && !selectAll && (
          <span className={styles.error}>
            {errors.branches.message as string}
          </span>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>
        הוסף הטבה
      </button>
    </form>
  );
}
