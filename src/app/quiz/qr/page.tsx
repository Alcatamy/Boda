"use client";

import React, { useState, useEffect } from "react";
import SectionIcon from "@/components/ui/SectionIcon";
import { Printer, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function QuizQRPage() {
  const [baseUrl, setBaseUrl] = useState("https://nadiayadrian.vercel.app");
  const [qrUrl, setQrUrl] = useState("");
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Dynamically set based on current origin if running in production
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const isLocal = window.location.hostname === "localhost" || 
                      window.location.hostname === "127.0.0.1" || 
                      window.location.hostname.endsWith(".local");
      setIsLocalhost(isLocal);
      
      if (!isLocal) {
        setBaseUrl(origin);
      }
    }
  }, []);

  useEffect(() => {
    setQrUrl(`${baseUrl}/quiz`);
  }, [baseUrl]);

  const handlePrint = () => {
    window.print();
  };

  // Render QR Code URL using QRServer API (color matching dark sage: 2a3d36)
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=2a3d36&bgcolor=fafaf9&data=${encodeURIComponent(
    qrUrl
  )}`;

  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--bg-secondary)",
      padding: "6rem 1rem 3rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-sans), sans-serif",
    }}>
      {/* Control panel - hidden during print */}
      <div className="no-print" style={{
        maxWidth: "600px",
        width: "100%",
        backgroundColor: "white",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "1.5rem",
        marginBottom: "2rem",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link href="/quiz" style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.9rem", color: "var(--color-primary-gold)" }}>
            <ArrowLeft size={16} /> Volver al Quiz
          </Link>
        </div>
        <h2 style={{ fontSize: "1.2rem", margin: 0, fontFamily: "var(--font-serif)" }}>
          Imprimir Carteles para las Mesas
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
          Coloca estos carteles en las mesas del cóctel o del banquete para que los invitados escaneen el código y jueguen en directo. Pulsa el botón "Imprimir" para sacar el cartel en formato físico.
        </p>

        {isLocalhost && (
          <div style={{
            backgroundColor: "#fffbeb",
            border: "1px solid #fef3c7",
            borderRadius: "var(--radius-sm)",
            padding: "0.8rem",
            fontSize: "0.85rem",
            color: "#b45309",
            lineHeight: "1.4",
            textAlign: "left"
          }}>
            ⚠️ <strong>Modo Desarrollo Detectado:</strong> El código QR apunta a <strong>{qrUrl}</strong>. Para imprimir el cartel definitivo para la boda, asegúrate de escribir vuestra dirección web de producción en el cuadro de texto abajo (ej: <code>https://nadiayadrian.vercel.app</code>) para que los invitados puedan entrar desde sus teléfonos móviles.
          </div>
        )}
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
            URL del Quiz (Modifica si cambia el dominio de producción):
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontSize: "0.9rem"
            }}
          />
        </div>

        <button
          onClick={handlePrint}
          style={{
            backgroundColor: "var(--color-primary-gold)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "0.8rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            transition: "background-color 0.2s"
          }}
        >
          <Printer size={18} /> Imprimir Cartel (A4 / Carta)
        </button>
      </div>

      {/* Printable Flyer Card */}
      <div className="printable-card" style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#fafaf9", // Off-white/Ivory
        border: "6px double var(--color-primary-gold)",
        borderRadius: "4px",
        padding: "3.5rem 2.5rem 3rem",
        textAlign: "center",
        boxShadow: "var(--shadow-lg)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Decorative corner borders */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          right: "10px",
          bottom: "10px",
          border: "1px solid rgba(197, 160, 89, 0.4)",
          pointerEvents: "none"
        }} />

        {/* Floral Top Icon */}
        <div style={{ marginBottom: "1rem" }}>
          <SectionIcon src="https://premiumelegante.thedigitalyes.com/assets/cupid-illustration-BO3_EWaD.png" />
        </div>

        {/* Couples Names */}
        <div style={{
          fontFamily: "var(--font-script)",
          fontSize: "2.4rem",
          color: "var(--color-primary-gold)",
          lineHeight: "1",
          marginBottom: "0.5rem"
        }}>
          Nadia & Adrián
        </div>

        <div style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "var(--color-text-muted)",
          marginBottom: "2rem"
        }}>
          25 de Julio de 2026
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.7rem",
          fontWeight: 400,
          lineHeight: "1.3",
          margin: "0 0 1.5rem",
          color: "var(--foreground)"
        }}>
          ¿Quién conoce más a los novios?
        </h1>

        <p style={{
          fontSize: "0.9rem",
          lineHeight: "1.6",
          color: "var(--text-secondary)",
          maxWidth: "32ch",
          marginBottom: "2rem"
        }}>
          ¡Entra en el quiz de boda en directo, responde a las preguntas y compite en el ranking de invitados!
        </p>

        {/* QR Code Container */}
        <div style={{
          padding: "1rem",
          backgroundColor: "#fafaf9",
          border: "1px solid rgba(197, 160, 89, 0.3)",
          borderRadius: "8px",
          marginBottom: "2.5rem",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeApiUrl}
            alt="Código QR del Quiz"
            style={{ width: "200px", height: "200px" }}
          />
        </div>

        {/* Instructions */}
        <div style={{
          textAlign: "left",
          width: "100%",
          paddingLeft: "0.5rem",
          borderLeft: "2px solid var(--color-primary-gold)"
        }}>
          <h4 style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: "0 0 0.5rem",
            color: "var(--color-primary-gold)"
          }}>
            Cómo jugar:
          </h4>
          <ol style={{
            fontSize: "0.85rem",
            lineHeight: "1.5",
            margin: 0,
            paddingLeft: "1.1rem",
            color: "var(--text-secondary)"
          }}>
            <li style={{ marginBottom: "0.3rem" }}>Abre la cámara de tu teléfono móvil.</li>
            <li style={{ marginBottom: "0.3rem" }}>Escanea el código QR de arriba.</li>
            <li>Introduce tu nombre y... ¡demuestra cuánto sabes!</li>
          </ol>
        </div>
      </div>

      {/* Global CSS for Print Mode */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            background: none !important;
            min-height: auto !important;
          }
          .printable-card {
            box-shadow: none !important;
            border-color: #c5a059 !important;
            margin: 0 auto !important;
            page-break-inside: avoid;
            background-color: #fafaf9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  );
}
