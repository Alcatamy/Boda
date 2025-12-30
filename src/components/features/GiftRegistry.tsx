"use client";

import { useState } from "react";
import { Check, Plane, Gift } from "lucide-react";
import Image from "next/image";
import styles from "./GiftRegistry.module.css";
import MessagesTicker from "@/components/features/Guestbook/MessagesTicker";

export default function GiftRegistry() {
  const [copied, setCopied] = useState(false);
  const iban = "ES98 0000 0000 0000 0000 0000"; // Placeholder

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                Un viaje al Sudeste Asiático es una aventura que requiere un gran esfuerzo.
                Cada aportación, por pequeña o grande que sea, nos ayuda a vivir esta experiencia inolvidable.
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

          {/* 2. INTERACTION GRID (Messages & Music) */}
          <div className={styles.interactionGrid}>

            {/* GUEST BOOK */}
            <div className={styles.interactionCard}>
              <h3>Déjanos un Mensaje</h3>
              <p className={styles.cardDesc}>¡Queremos leer tus palabras el día de la boda!</p>

              <form className={styles.cleanForm} onSubmit={(e) => { e.preventDefault(); alert("¡Gracias! Tu mensaje ha sido guardado con mucho cariño."); }}>
                <input type="text" placeholder="Tu Nombre (Ej: Tía Paqui)" required className={styles.cleanInput} />
                <textarea placeholder="Tu mensaje..." rows={3} className={styles.cleanTextarea} />
                <button type="submit" className={styles.cleanBtn}>Enviar Mensaje</button>
              </form>

              <div className={styles.tickerWrapper}>
                <MessagesTicker />
              </div>
            </div>

            {/* MUSIC REQUEST */}
            <div className={styles.interactionCard}>
              <h3>🎵 Pon tu Canción</h3>
              <p className={styles.cardDesc}>¡Cuéntanos qué no puede faltar en la pista!</p>

              <form className={styles.cleanForm} onSubmit={(e) => { e.preventDefault(); alert("¡Anotada! La pondremos para bailar."); }}>
                <input type="text" placeholder="Tu Nombre" required className={styles.cleanInput} />
                <input type="text" placeholder="Canción / Artista" required className={styles.cleanInput} />
                <button type="submit" className={styles.cleanBtn}>Enviar Sugerencia</button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
