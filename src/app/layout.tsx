import type { Metadata } from "next";
import { Baloo_2, Poppins, Barlow } from "next/font/google";
import { SmoothScrollController } from "@/components/smooth-scroll-controller";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Mystery Scoop",
  description: "Pick a scoop, add a lucky twist, and watch your mystery assortment come to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${poppins.variable} ${barlow.variable} antialiased font-poppins`}>
        <SmoothScrollController />
        {children}
      </body>
    </html>
  );
}
