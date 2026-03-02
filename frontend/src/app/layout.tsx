import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { BottomNav } from "@/components/BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { HelpButton } from "@/components/HelpButton";
import { OnboardingTutorial } from "@/components/OnboardingTutorial";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    template: "%s | JAMB Quiz Master",
    default: "JAMB Quiz Master | Elite AI Practice",
  },
  description: "Ace your JAMB exams with AI-powered personalized practice, smart analytics, and real-time RAG context explanations. Achieve a 300+ score effortlessly.",
  keywords: ["JAMB", "CBT", "Exam", "Nigeria", "AI Tutor", "Study", "University"],
  authors: [{ name: "JAMB Quiz Systems" }],
  creator: "JAMB Quiz Engineering",
  openGraph: {
    title: "JAMB Quiz Master | Real-Time AI Proctor & Analytics",
    description: "Prepare intelligently for standard JAMB exams with live generated explanations and hyper-accurate Vector Store Contexts.",
    url: "https://jamb-quiz.vercel.app",
    siteName: "JAMB Quiz Master",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JAMB Quiz Master | Elite AI Tutor",
    description: "Beat the JAMB curve using AI algorithms generating contextual past-question scenarios for maximum recall.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Wrap everything inside the React State securely
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${jakarta.variable} ${inter.variable} font-sans antialiased bg-slate-950 text-white min-h-screen flex flex-col`}>
        <AuthProvider>
          <OfflineIndicator />
          <OnboardingTutorial />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #334155'
              },
              success: { iconTheme: { primary: '#4CAF50', secondary: '#fff' } },
              error: { iconTheme: { primary: '#FF5252', secondary: '#fff' } }
            }}
          />
          <div className="flex-1 pb-20 md:pb-0">
            {children}
          </div>
          <HelpButton />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
