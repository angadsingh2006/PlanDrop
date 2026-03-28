import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlanDrop — Group plans, first come first served",
  description:
    "Browse a live pool of AI-curated outings for your crew. Claim one before it’s gone — then share the link and go.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-white font-sans text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
