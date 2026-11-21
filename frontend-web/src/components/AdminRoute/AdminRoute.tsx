import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import StateBlock from "../StateBlock/StateBlock";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <StateBlock variant="loading" />;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
