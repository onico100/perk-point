"use client"

import { User } from "@/types/types";

interface UserPersonalDetailsProps {
    currentUser: User;
  }
  
  export default function UserPersonalDetails({ currentUser }: UserPersonalDetailsProps) {
    return (
      <div>
        <h2>User Details</h2>

      </div>
    );
  }