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

        {/* GIFT SECTION */}
        <div className={styles.crowdSection}>
          <div className={styles.headerCentered}>
            <span className={styles.smallTag}>DÉJANOS TU HUELLA</span>
            <h2 className={styles.titleLarge}>Únete a la Aventura</h2>
            <p className={styles.textMuted}>Cada aportación nos acerca un poco más a hacer realidad este viaje único.</p>
          </div>

          <div className={styles.dashboardCard}>

            {/* ACTION GRID */}
            <div className={styles.actionGrid}>

              {/* LEFT: BANK DETAILS (Passive) */}
              <div className={styles.bankColumn}>
                <h3>Tu Regalo</h3>
                <p className={styles.stepDesc}>
                  Un viaje al Sudeste Asiático es una aventura que requiere un gran esfuerzo.
                  Cada aportación, por pequeña o grande que sea, nos ayuda a vivir esta experiencia inolvidable.
                </p>

                <div className={styles.ibanCard}>
                  <div className={styles.ibanHeader}>
                    <div className={styles.bankIcon}><Gift size={20} /></div>
                    <span>Cuenta de Boda</span>
                  </div>
                  <code className={styles.ibanCode}>{iban}</code>
                  <button onClick={copyToClipboard} className={styles.copyBtnText}>
                    {copied ? "¡Copiado!" : "Copiar IBAN"}
                  </button>
                  <div className={styles.bankMeta}>
                    <span>Titulares: Nadia & Adrián</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: GUEST BOOK */}
              <div className={styles.pledgeColumn}>
                <h3>Déjanos un Mensaje</h3>
                <p className={styles.stepDesc}>¡Queremos leer tus palabras el día de la boda!</p>

                <form className={styles.pledgeForm} onSubmit={(e) => { e.preventDefault(); alert("¡Gracias! Tu mensaje ha sido guardado con mucho cariño."); }}>
                  <div className={styles.inputGroup}>
                    <label>Tu Nombre</label>
                    <input type="text" placeholder="Ej: Tía Paqui" required className={styles.input} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Tu Mensaje para los Novios</label>
                    <textarea placeholder="¡Que seáis muy felices! Os queremos mucho..." rows={3} className={styles.textarea} />
                  </div>

                  <button type="submit" className={styles.pledgeBtn}>
                    <Check size={18} /> Enviar Mensaje
                  </button>
                </form>

                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--color-accent)' }}>Mensajes Recientes</h4>
                  <MessagesTicker />
                </div>
              </div>

              {/* THIRD: MUSIC REQUEST */}
              <div className={styles.pledgeColumn}>
                <h3>🎵 Pon tu Canción</h3>
                <p className={styles.stepDesc}>No existe fiesta sin buena música. ¡Cuéntanos qué no puede faltar!</p>

                <form className={styles.pledgeForm} onSubmit={(e) => { e.preventDefault(); alert("¡Anotada! La pondremos para bailar."); }}>
                  <div className={styles.inputGroup}>
                    <label>Tu Nombre</label>
                    <input type="text" placeholder="Ej: Primo Javi" required className={styles.input} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Canción / Artista</label>
                    <input type="text" placeholder="Ej: Coldplay - Adventure of a Lifetime" required className={styles.input} />
                  </div>

                  <button type="submit" className={styles.pledgeBtn}>
                    <Check size={18} /> Enviar Sugerencia
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
