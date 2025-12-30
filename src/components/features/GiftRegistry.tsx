"use client";

import { useState } from "react";
import { Check, Plane, Gift, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import styles from "./GiftRegistry.module.css";
import MessagesTicker from "@/components/features/Guestbook/MessagesTicker";

export default function GiftRegistry() {
  const [copied, setCopied] = useState(false);
  const [msgStatus, setMsgStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const iban = "ES13 2085 8024 9103 3048 5312";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsgStatus("loading");
    const formData = new FormData(e.currentTarget);
    const sender = formData.get("sender") as string;
    const message = formData.get("message") as string;

    const { error } = await supabase
      .from("messages")
      .insert({ sender_name: sender, content: message });

    if (error) {
      console.error(error);
      setMsgStatus("error");
    } else {
      setMsgStatus("success");
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <section id="registry" className={styles.section}>
      <div className={styles.container}>

        {/* HERO: Honeymoon Fund */}
        <div className={styles.heroRow}>
          <div className={styles.heroContent}>
            <div className={styles.tag}>
              <Plane size={14} />
              <span>DESTINO: VIETNAM, BALI E ISLAS GILI</span>
            </div>

            <h2 className={styles.heroTitle}>
              Nuestro Fondo de <br />
              <span className={styles.gradientText}>Luna de Miel</span>
            </h2>

            <p className={styles.heroText}>
              Vuestra compañía es el regalo más valioso. Sin embargo, para aquellos que deseéis tener un detalle, hemos creado este fondo destinado a hacer realidad nuestra <strong>Gran Aventura</strong> por el Sudeste Asiático e Islas Paradisíacas.
            </p>
          </div>

          <div className={styles.imageCard}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/registry/banner.png"
                alt="Vietnam, Bali e Islas Gili"
                fill
                className={styles.heroImage}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
              <div className={styles.imageOverlay} />
            </div>
          </div>
        </div>

        {/* GIFT SECTION - RESTRUCTURED */}
        <div className={styles.crowdSection}>

          <div className={styles.headerCentered}>
            <span className={styles.smallTag}>DÉJANOS TU HUELLA</span>
            <h2 className={styles.titleLarge}>Únete a la Aventura</h2>
            <p className={styles.textMuted}>Cada aportación nos acerca un poco más a hacer realidad este viaje único.</p>
          </div>

          {/* 1. BANK INFO - CENTERED & PROMINENT */}
          <div className={styles.bankSection}>
            <div className={styles.bankContent}>
              <Gift size={32} className={styles.bankIconMain} />
              <h3>Tu Regalo</h3>
              <p className={styles.stepDesc}>
                Para nosotros, lo más importante es vivir este día con vosotros.
                Si deseáis ayudarnos a cumplir el sueño de nuestro viaje de novios, podéis hacerlo aquí.
                ¡Gracias por ser parte de nuestra historia!
              </p>

              <div className={styles.ibanContainer}>
                <div className={styles.ibanBox}>
                  <span className={styles.ibanLabel}>Cuenta de Boda (Nadia & Adrián)</span>
                  <code className={styles.ibanCode}>{iban}</code>
                </div>
                <button onClick={copyToClipboard} className={styles.copyBtnPrimary}>
                  {copied ? <Check size={18} /> : null}
                  {copied ? "¡Copiado!" : "Copiar IBAN"}
                </button>
              </div>
            </div>
          </div>

          {/* 2. INTERACTION GRID (Messages Only) */}
          <div className={styles.interactionGrid}>

            {/* GUEST BOOK */}
            <div className={styles.interactionCard} style={{ gridColumn: "1 / -1", maxWidth: "800px", margin: "0 auto" }}>
              <h3>Déjanos un Mensaje</h3>
              <p className={styles.cardDesc}>Tus palabras saldrán reflejadas en la web para que todo el mundo las pueda ver.</p>

              <form className={styles.cleanForm} onSubmit={handleMessageSubmit}>
                <input name="sender" type="text" placeholder="Tu Nombre (Ej: Tía Paqui)" required className={styles.cleanInput} />
                <textarea name="message" placeholder="Tu mensaje..." rows={3} required className={styles.cleanTextarea} />
                <button type="submit" className={styles.cleanBtn} disabled={msgStatus === "loading" || msgStatus === "success"}>
                  {msgStatus === "loading" ? <Loader2 className="animate-spin" size={16} /> : msgStatus === "success" ? "¡Enviado!" : "Enviar Mensaje"}
                </button>
              </form>

              <div className={styles.tickerWrapper}>
                <MessagesTicker />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
