import type { Metadata } from "next";
import {  Poppins } from "next/font/google";
import "./globals.css";


export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
  title: "Torres hanoi",
  description: "Torres de Hanoi Udenar - Sistemas inteligentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
