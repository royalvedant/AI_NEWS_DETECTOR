import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AI Newsroom | Future of Business Intelligence",
  description: "Personalized AI-Native Business News Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-screen font-sans bg-zinc-950 text-slate-50 antialiased selection:bg-indigo-500/30`}>
        <Navbar />
        <main className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
        {/* Floating AI Chat widget could go here globally for access everywhere */}
      </body>
    </html>
  );
}
