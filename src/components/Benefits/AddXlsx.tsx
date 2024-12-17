import React, { useState } from "react";
import useGeneralStore from "@/stores/generalStore";
import * as XLSX from "xlsx";
import { useFetchBenefits } from "@/hooks/useFetchBenefits";
import { successAlert } from "@/utils/sweet-alerts";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import styles from "./addXlsx.module.css"; 
import { Branch, Club } from "@/types/types";

interface Benefit {
  supplierId: string;
  clubId: string;
  redemptionConditions: string;
  description: string;
  expirationDate: Date;
  branches: Branch[];
  isActive: boolean;
}

export default function AddXlsxComponent() {
  const { currentSupplier } = useGeneralStore();
  const { addBenefit } = useFetchBenefits();
  const { clubs } = useFetchGeneral();

  const [excelData, setExcelData] = useState<Benefit[]>([]);
  const [excelPreview, setExcelPreview] = useState(false);

  const handleExcelUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    clubs: { _id: string; clubName: string }[]
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const benefits = parsedData
        .map((row: any) => {
          const associatedClubs = clubs
            .filter((club) => row[club.clubName] === "V")
            .map((club) => club._id);

          return associatedClubs.map((clubId) => ({
            supplierId: currentSupplier?._id || "",
            clubId,
            redemptionConditions: row["תנאים"] || "",
            description: row["תיאור"] || "",
            expirationDate: new Date(row["תוקף"]),
            branches: currentSupplier?.branches || [],
            isActive: true,
          }));
        })
        .flat();

      setExcelData(benefits);
      setExcelPreview(true);
    };

    reader.readAsBinaryString(file);
  };

  const downloadTemplate = (clubs: { _id: string; clubName: string }[]) => {
    const headers = ["תיאור", "תנאים", "תוקף", ...clubs.map((club) => club.clubName)];
    const exampleData = [["מבצע לדוגמה", "תנאי לדוגמה", "2024-12-31", ...clubs.map(() => "")]];
    const templateData = [headers, ...exampleData];
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "תבנית הטבות");
    XLSX.writeFile(workbook, "תבנית_הטבות.xlsx");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>הוספת הטבות מקובץ Excel</h2>
      <button onClick={() => downloadTemplate(clubs || [])} className={styles.button}>
        הורדת תבנית Excel
      </button>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => handleExcelUpload(e, clubs || [])}
        className={styles.input}
      />

      {excelPreview && (
        <div className={styles.preview}>
          <h3>תצוגה מקדימה של ההטבות</h3>
          <ul>
            {excelData.map((benefit, index) => (
              <li key={index}>
                <p>
                  <strong>תיאור:</strong> {benefit.description} <br />
                  <strong>תנאים:</strong> {benefit.redemptionConditions} <br />
                  <strong>תוקף:</strong> {benefit.expirationDate.toDateString()} <br />
                  <strong>מועדון:</strong>{" "}
                  {clubs.find((c : Club) => c._id === benefit.clubId)?.clubName}
                </p>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              excelData.forEach((benefit) => addBenefit(benefit));
              successAlert("ההטבות נוספו בהצלחה!");
              setExcelData([]);
              setExcelPreview(false);
            }}
            className={styles.approveButton}
          >
            אישור והוספה
          </button>
        </div>
      )}
    </div>
  );
}