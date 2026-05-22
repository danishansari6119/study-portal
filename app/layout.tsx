// app/layout.tsx
// Root layout — applies fonts, theme, and global providers

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/layout/session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudyPortal — Your Academic Hub",
    template: "%s | StudyPortal",
  },
  description:
    "A modern student study portal for managing notes, assignments, quizzes, attendance, and schedules.",
  keywords: ["study", "education", "portal", "students", "assignments", "notes"],
  authors: [{ name: "StudyPortal" }],
  openGraph: {
    type: "website",
    title: "StudyPortal",
    description: "Your complete academic management platform",
    siteName: "StudyPortal",
  },
  twitter: { card: "summary_large_image", title: "StudyPortal" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
