//src/app/page
import SideBar from "@/components/Bars/SideBar";
import TopBar from "@/components/Bars/TopBar";
import Link from "next/link";

export default function Home() {
  return (
    <div>   
      <TopBar />
      <SideBar />
      <p>Hello from page</p>
      <Link href="/login">Go to login Page</Link> 
    </div>
  );
}

