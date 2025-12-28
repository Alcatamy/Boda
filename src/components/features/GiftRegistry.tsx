"use client";

import { useState } from "react";
import { Copy, Check, Plane, Gift, Lock, Info } from "lucide-react";
import Image from "next/image";
import styles from "./GiftRegistry.module.css";

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
              <span>DESTINO: VIETNAM Y BALI</span>
            </div>
            
            <h2 className={styles.heroTitle}>
              Nuestro Fondo de <br />
              <span className={styles.gradientText}>Luna de Miel</span>
            </h2>
            
            <p className={styles.heroText}>
              Vuestra compañía es el regalo más valioso. Sin embargo, para aquellos que deseéis tener un detalle, hemos creado este fondo destinado a hacer realidad nuestra <strong>Gran Aventura</strong> por el Sudeste Asiático.
            </p>
          </div>

          <div className={styles.imageCard}>
            <div className={styles.imageWrapper}>
              <Image 
                src="/images/registry/banner.png"
                alt="Vietnam y Bali"
                fill
                className={styles.heroImage}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" 
              />
              <div className={styles.imageOverlay} />
            </div>

            {/* Progress Bar Overlay */}
            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Objetivo del Viaje</span>
                <span className={styles.progressValue}>75%</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>



        {/* CONTRIBUTE SECTION */}
        <div className={styles.contributeSection}>
          <div className={styles.headerCentered}>
            <span className={styles.smallTag}>DETALLE EXCLUSIVO</span>
            <h2 className={styles.titleLarge}>Forma parte del sueño</h2>
            <p className={styles.textMuted}>Cada aportación nos acerca un paso más a esta experiencia única.</p>
          </div>

          <div className={styles.paymentGrid}>
            
            {/* Bank Transfer */}
            <div className={styles.paymentCard}>
              <div className={styles.cardHeader}>
                 <div className={styles.iconCircle}><Gift size={24} /></div>
                 <h3>Transferencia Bancaria</h3>
              </div>
              
              <div className={styles.cardBody}>
                
                <div className={styles.ibanBox}>
                  <span className={styles.labelTiny}>IBAN</span>
                  <div className={styles.ibanRow}>
                    <code className={styles.ibanCode}>{iban}</code>
                    <button onClick={copyToClipboard} className={styles.copyBtn} aria-label="Copiar">
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.detailsRow}>
                   <div className={styles.detailBox}>
                      <span className={styles.labelTiny}>TITULARES</span>
                      <p className={styles.detailValue}>Nadia & Adrián</p>
                   </div>
                   <div className={styles.detailBox}>
                      <span className={styles.labelTiny}>BIC/SWIFT</span>
                      <p className={styles.detailValue}>BSCHESMMXXX</p>
                   </div>
                </div>

                <div className={styles.infoBox}>
                  <Info size={16} className={styles.infoIcon} />
                  <p>Por favor, indicad vuestros nombres en el concepto para poder agradeceros.</p>
                </div>

              </div>
            </div>

            {/* Placeholder for "Stripe/Card" future integration or fake UI */}
            <div className={`${styles.paymentCard} ${styles.cardInactive}`}>
              <div className={styles.cardHeader}>
                 <div className={styles.iconCircle}><Lock size={24} /></div>
                 <h3>Pago con Tarjeta</h3>
              </div>
              <div className={styles.cardBodyCentered}>
                <p>Próximamente disponible</p>
                <span className={styles.comingSoonBadge}>En construcción</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
