import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "RAPL AI";

export const metadata: Metadata = {
  title: `${siteName} - AI-Powered Programming Learning Platform`,
  description: "Master programming with reinforcement learning powered education. Get personalized MCQ-based learning paths, smart recommendations, and detailed performance insights.",
  keywords: ["programming", "learning", "MCQ", "education", "AI", "reinforcement learning"],
  authors: [{ name: siteName }],
  creator: siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="rapl-theme">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
