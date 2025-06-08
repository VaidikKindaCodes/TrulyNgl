import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/context/authprovider";
import { NavbarComp } from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black overflow-x-hidden">
        <AuthProvider>
          <NavbarComp />
           {children}
          <Toaster />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
