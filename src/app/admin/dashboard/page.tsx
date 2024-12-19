"use client";
import ContDashPage from "@/components/admin/contactManagement";
import { useRouter } from "next/navigation";
import styles from "@/styles/dashboard.module.css";
import DashboardComp from "@/components/admin/dashboardComponent";


const dashPage = () => {
  const router = useRouter();


  return (
    <div className={styles.dashboard}> 
      <DashboardComp/>                                          
    </div>
  )
}

export default dashPage;
