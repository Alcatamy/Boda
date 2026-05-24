import React from "react";
import QuizGame from "@/components/quiz/QuizGame";
import SectionIcon from "@/components/ui/SectionIcon";
import WaveDivider from "@/components/ui/WaveDivider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Quién conoce más a los novios? | Nadia y Adrián",
  description: "Pon a prueba tus conocimientos sobre Nadia y Adrián. Responde las preguntas, entra al ranking de invitados y diviértete.",
};

export default function QuizPage() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "7rem 1rem 4rem", // Top padding to avoid header overlap
      position: "relative",
      background: "var(--bg-secondary)",
      overflow: "hidden"
    }}>
      {/* Dynamic colorful glowing background orbs */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(197, 160, 89, 0.18) 0%, rgba(197, 160, 89, 0) 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0,
        animation: "floatSlow 16s infinite ease-in-out"
      }} />
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "5%",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, rgba(244, 63, 94, 0) 70%)", // Rose
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0,
        animation: "floatReverse 20s infinite ease-in-out"
      }} />
      <div style={{
        position: "absolute",
        top: "55%",
        left: "-5%",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0) 70%)", // Sky Blue
        filter: "blur(50px)",
        pointerEvents: "none",
        zIndex: 0,
        animation: "floatSlow 18s infinite ease-in-out 3s"
      }} />

      {/* Elegante Icono de Cabecera decorativo */}
      <div style={{ marginBottom: "1rem", zIndex: 5 }}>
        <SectionIcon src="https://premiumelegante.thedigitalyes.com/assets/cupid-illustration-BO3_EWaD.png" />
      </div>

      {/* El Contenedor del Juego */}
      <div style={{ width: "100%", maxWidth: "650px", zIndex: 10 }}>
        <QuizGame />
      </div>

      <div style={{ marginTop: "4rem", width: "100%" }}>
        <WaveDivider flip />
      </div>

      <footer style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "2rem 1rem",
        textAlign: "center",
        color: "var(--color-primary-gold)",
        fontFamily: "var(--font-sans)",
        fontSize: "0.75rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        opacity: 0.8
      }}>
        <p style={{ margin: 0, textAlign: "center" }}>
          Nadia & Adrián • 2026
        </p>
      </footer>
    </main>
  );
}
