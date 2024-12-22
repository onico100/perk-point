"use client";
import { useRouter } from "next/navigation";
import DashboardComp from "@/components/admin/dashboardComponent";


const dashPage = () => {
  const router = useRouter();


  return (
    <div > 
      <DashboardComp/>                                          
    </div>
  )
}

export default dashPage;
