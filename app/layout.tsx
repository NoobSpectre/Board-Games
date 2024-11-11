import type { Metadata } from "next";
import { Alegreya, Poppins } from "next/font/google";

import { NextQueryClientProvider } from "@/providers";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "./header";

const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-heading",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Board Games",
  description: "Simple board games for fun and testing IQ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NextQueryClientProvider>
        <body
          className={`${poppins.variable} ${alegreya.variable} antialiased`}
        >
          <Header />
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </NextQueryClientProvider>
    </html>
  );
}
