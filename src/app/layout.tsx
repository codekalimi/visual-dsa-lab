import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visual DSA Lab",
  description:
    "Interactive step-by-step visualizations for arrays, linked lists, trees, and graphs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
