"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import styles from "@/styles/admin/usersManagement.module.css";
import { useUsersStatistics } from "@/hooks/useFetchUsers";
import { useFetchGeneral } from "@/hooks/useFetchGeneral";
import { Club } from "@/types/ClubTypes";
import LoadingSpinner from "../Loading/LoadingSpinner";

const UsersManagement = () => {
  const { users, isLoading } = useUsersStatistics();
  const { clubs } = useFetchGeneral();
  const usersByMonth = Array(12).fill(0);
  const clubCounts: { [key: string]: number } = {};

  if (Array.isArray(users)) {
    users.forEach((user) => {
      const month = new Date(user.registrationDate).getMonth();
      usersByMonth[month]++;

      user.clubs?.forEach((clubId: string) => {
        if (clubCounts[clubId]) {
          clubCounts[clubId]++;
        } else {
          clubCounts[clubId] = 1;
        }
      });
    });
  }

  const usersChartData = {
    labels: [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר",
    ],
    datasets: [
      {
        label: "משתמשים שהצטרפו",
        data: usersByMonth,
        backgroundColor: "rgb(112, 31, 205)",
        borderColor: " #5a0db1",
        borderWidth: 1,
      },
    ],
  };

  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
      colors.push(randomColor);
    }
    return colors;
  };

  const clubsChartData = {
    labels:
      clubs
        ?.filter((club: Club) => clubCounts[club._id || " "])
        .map((club: Club) => club.clubName) || [],
    datasets: [
      {
        label: "מועדונים פופולאריים",
        data:
          clubs
            ?.filter((club: Club) => clubCounts[club._id || " "])
            .map((club: Club) => clubCounts[club._id || " "]) || [],
        backgroundColor: generateColors(
          clubs?.filter((club: Club) => clubCounts[club._id || " "]).length || 0
        ),
      },
    ],
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <h1>ניהול משתמשים</h1>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <h2>הצטרפות לפי חודשים</h2>
          <Bar data={usersChartData} />
        </div>
        <div className={styles.chart}>
          <h2>מועדונים פופולאריים</h2>
          <Pie data={clubsChartData} />
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
