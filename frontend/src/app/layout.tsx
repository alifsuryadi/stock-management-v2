// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/Layout";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Management System",
  description: "Professional stock management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-dark-900 transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            <Layout>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: "dark:bg-gray-800 dark:text-white",
                  duration: 4000,
                }}
              />
            </Layout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
