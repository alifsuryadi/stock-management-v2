// frontend/src/components/Layout.tsx
"use client";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { admin } = useAuth();

  if (!admin) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
