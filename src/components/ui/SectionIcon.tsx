"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Wine, Gift, Camera } from "lucide-react";

export default function SectionIcon({ src, iconType }: { src?: string; iconType?: "heart" | "cupid" | "wine" | "gift" | "camera" }) {
  const [hasError, setHasError] = useState(false);

  const renderFallbackIcon = () => {
    if (src?.includes("locket") || iconType === "heart") return <Heart size={26} style={{ color: "var(--color-primary-gold)" }} />;
    if (src?.includes("cupid") || iconType === "cupid") return <Sparkles size={26} style={{ color: "var(--color-primary-gold)" }} />;
    if (src?.includes("champagne") || iconType === "wine") return <Wine size={26} style={{ color: "var(--color-primary-gold)" }} />;
    if (src?.includes("floral") || iconType === "gift") return <Gift size={26} style={{ color: "var(--color-primary-gold)" }} />;
    return <Camera size={26} style={{ color: "var(--color-primary-gold)" }} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        zIndex: 10,
        marginTop: "2rem",
        marginBottom: "-3rem",
      }}
    >
      {!hasError && src ? (
        <motion.img
          src={src}
          alt="Decoración elegante"
          style={{ width: "90px", height: "auto", objectFit: "contain" }}
          onError={() => setHasError(true)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <div style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "rgba(197, 160, 89, 0.12)",
          border: "1px solid rgba(197, 160, 89, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(197, 160, 89, 0.15)"
        }}>
          {renderFallbackIcon()}
        </div>
      )}
    </motion.div>
  );
}

