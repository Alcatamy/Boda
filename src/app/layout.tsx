import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import fonts
import "@/styles/globals.css";

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Adriana y Adrián | Nuestra Boda",
  description: "Acompáñanos a celebrar nuestro gran día. Confirma tu asistencia y descubre todos los detalles.",
  openGraph: {
    title: "Adriana y Adrián | Nuestra Boda",
    description: "Acompáñanos a celebrar nuestro gran día.",
    url: "https://boda-adriana-adrian.vercel.app", // Placeholder
    siteName: "Adriana y Adrián Wedding",
    images: [
      {
        url: "/og-image.jpg", // We assume this exists or will exist
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

import Header from "@/components/layout/Header";
import ChatWidget from "@/components/features/ChatWidget";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Preloader from "@/components/ui/Preloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Preloader />
        <NoiseOverlay />
        <Header />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
