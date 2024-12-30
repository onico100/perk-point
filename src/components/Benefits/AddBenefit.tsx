"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styles from "@/styles/Benefits/AddBenefit.module.css";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import useGeneralStore from "@/stores/generalStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveNotApiClubs } from "@/utils/clubsUtils";
import { Club } from "@/types/ClubTypes";
import { Benefit, benefitSchema, Branch } from "@/types/BenefitsTypes";

export default function AddBenefit() {
  const router = useRouter();
  const { currentSupplier } = useGeneralStore();
  const id = currentSupplier?._id;
  const [selectAll, setSelectAll] = useState(true);
  const branches = currentSupplier?.branches || [];

  const { clubs } = useFetchGeneral();
  let clubsToShow: Club[] = [];
  if (clubs) clubsToShow = getActiveNotApiClubs(clubs);
  const { addBenefit } = useFetchBenefits();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(benefitSchema),
    defaultValues: {
      supplierId: "000",
      branches: ["all"],
      counter: 0,
      description: "",
      redemptionConditions: "",
      expirationDate: "",
      clubId: "",
    },
  });

  console.log(errors)

  const onSubmit = (data: any) => {
    console.log(errors)
    const selectedBranches = selectAll
      ? branches
      : branches.filter((b: any) => data.branches.includes(b.nameBranch));

    const newBenefit = {
      supplierId: id,
      clubId: data.clubId,
      redemptionConditions: data.redemptionConditions,
      description: data.description,
      expirationDate: new Date(data.expirationDate),
      branches: selectedBranches,
      isActive: true,
      counter: 0,
    } as Benefit;

    console.log(newBenefit);

    addBenefit(newBenefit);
    router.push(`/benefits/${id}`);
  };

  const selectedBranches = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      setValue("branches", newSelectAll ? branches.map((b: any) => b.nameBranch) : []);
      return newSelectAll;
    });
  };
  

  return (
    <div>
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
          <select id="clubId" className={styles.select} {...register("clubId")}>
            <option value="">בחר מועדון</option>
            {clubsToShow?.map((club: Club) => (
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

        <div className={styles.inputContainer}>
          <label className={styles.label}>סניפים</label>
          <div>
            <label>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={selectedBranches}
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
    </div>
  );
}
