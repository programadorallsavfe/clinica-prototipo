import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SystemInitializer } from "@/lib/hooks";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SystemInitializer>
            {children}
          </SystemInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
