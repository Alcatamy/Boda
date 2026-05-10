"use client";

import { useState } from "react";
import { Check, Gift, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
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
      .insert({ 
        sender_name: sender,
        content: message
      });

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
        <motion.div 
          className={styles.heroRow}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.heroContent}>
            <div className={styles.tag}>
              <Gift size={14} />
              <span>NUESTRO MEJOR REGALO ERES TÚ</span>
            </div>

            <h2 className={styles.heroTitle}>
              Tu regalo nos hace <br />
              <span className={styles.gradientText}>Mucha Ilusión</span>
            </h2>

            <p className={styles.heroText}>
              Lo más importante para nosotros es que nos acompañéis a celebrar este día tan especial. ¡Que no faltéis ya es nuestro mejor regalo!
            </p>
          </div>

          <div className={styles.imageCard}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/story/PXL_20250801_103322546.jpg"
                alt="Nuestro Regalo"
                fill
                className={styles.heroImage}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
              <div className={styles.imageOverlay} />
            </div>
          </div>
        </motion.div>

        {/* GIFT SECTION - RESTRUCTURED */}
        <div className={styles.crowdSection}>

          {/* 1. BANK INFO - CENTERED & PROMINENT */}
          <motion.div 
            className={styles.bankSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.bankContent}>
              <Gift size={32} className={styles.bankIconMain} />
              <p className={styles.stepDesc}>
                Si además queréis tener un detalle extra para apoyarnos y acompañarnos en nuestra nueva etapa, hemos habilitado el siguiente número de cuenta. ¡Infinitas gracias de corazón!
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
          </motion.div>

          {/* 2. INTERACTION GRID (Messages Only) */}
          <div className={styles.interactionGrid}>

            {/* GUEST BOOK */}
            <motion.div 
              className={styles.interactionCard} 
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Déjanos un Mensaje</h3>
              <p className={styles.cardDesc} style={{ margin: "0 auto 2rem auto", maxWidth: "400px" }}>Tus palabras saldrán reflejadas en la web para que todo el mundo las pueda ver.</p>

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
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
