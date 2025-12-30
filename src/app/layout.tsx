import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google"; // Import fonts
import "@/styles/globals.css";

// Configure fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Nadia y Adrián | Nuestra Boda",
  description: "Acompáñanos a celebrar nuestro gran día. Confirma tu asistencia y descubre todos los detalles.",
  openGraph: {
    title: "Nadia y Adrián | Nuestra Boda",
    description: "Acompáñanos a celebrar nuestro gran día.",
    url: "https://boda-nadia-adrian.vercel.app", // Placeholder
    siteName: "Nadia y Adrián Wedding",
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

import ClientLayout from "@/components/layout/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body>
        <Preloader />
        <NoiseOverlay />
        <ClientLayout>
          <Header />
          {children}
          <ChatWidget />
        </ClientLayout>
      </body>
    </html>
  );
}
