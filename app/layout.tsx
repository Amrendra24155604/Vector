// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth";
import GlobalFocusCursor from "@/components/GlobalFocusCursor";
import GlobalPageLoader from "@/components/GlobalPageLoader";

export const metadata: Metadata = {
  title: "Vector – AI Career Coach for College Students",
  description:
    "Smart resume analyzer, internship matching, AI mock interviews, cold email generator, and career progress tracking – all in one AI-powered platform.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <GlobalPageLoader />
          <Sidebar />
          {children}
          <Footer />
          <GlobalFocusCursor />
        </AuthProvider>
      </body>
    </html>
  );
}

