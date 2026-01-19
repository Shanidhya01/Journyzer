"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TripPlannerLoading from "./Loader";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) return <p className="p-10"><TripPlannerLoading /></p>;
  if (!user) return null;
  return children;
}