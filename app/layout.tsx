// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth";
import GlobalFocusCursor from "@/components/GlobalFocusCursor";
import GlobalPageLoader from "@/components/GlobalPageLoader";
import { Inter, Space_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

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
    <html lang="en" className={`dark ${inter.variable} ${spaceMono.variable}`}>
      <head>
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

