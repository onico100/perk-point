"use client";
import { getAllDocuments } from "@/services/mongo";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
export default function Home() {
  const queryClient = new QueryClient();
  return (
    <div>
        <QueryClientProvider client={queryClient}>
          <p>Hellooooo</p>
        </QueryClientProvider>
    </div>
  );
}

