import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SystemInitializer } from "@/lib/hooks";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clínica Prototype - Sistema de Gestión Clínica",
  description: "Sistema integral de gestión para clínicas médicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SystemInitializer>
          {children}
        </SystemInitializer>
      </body>
    </html>
  );
}
