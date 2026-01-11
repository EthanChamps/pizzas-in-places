import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pizzas in Places | Fresh Sourdough Pizza",
  description:
    "Fresh sourdough pizza made daily from our renovated horse trailer. Find us across the Cotswolds.",
  keywords: "pizza, sourdough, wood-fired, Cotswolds, mobile pizza",
  openGraph: {
    title: "Pizzas in Places | Fresh Sourdough Pizza",
    description: "Fresh sourdough pizza made daily from our renovated horse trailer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
