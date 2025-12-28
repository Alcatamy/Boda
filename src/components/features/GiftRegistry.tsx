"use client";

import { useState } from "react";
import { Check, Plane, Gift } from "lucide-react";
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

        {/* CROWDFUNDING DASHBOARD */}
        <div className={styles.crowdSection}>
          <div className={styles.headerCentered}>
            <span className={styles.smallTag}>HAZ TU REGALO</span>
            <h2 className={styles.titleLarge}>Únete a la Aventura</h2>
            <p className={styles.textMuted}>Tu aportación hace posible cada kilómetro de este viaje.</p>
          </div>

          <div className={styles.dashboardCard}>
            
            {/* STATS ROW */}
            <div className={styles.statsRow}>
               <div className={styles.statBox}>
                 <span className={styles.statLabel}>Objetivo Conseguido</span>
                 <span className={styles.statValue}>75%</span>
                 <div className={styles.miniBar}><div style={{width: '75%'}} className={styles.miniBarFill}></div></div>
               </div>
               <div className={styles.statBoxHighlight}>
                 <span className={styles.statLabel}>Aportación Media</span>
                 <span className={styles.statValue}>170€</span>
                 <span className={styles.statSub}>Regalo más frecuente</span>
               </div>
               <div className={styles.statBox}>
                 <span className={styles.statLabel}>Participantes</span>
                 <span className={styles.statValue}>84</span>
               </div>
            </div>

            {/* ACTION GRID */}
            <div className={styles.actionGrid}>
              
              {/* LEFT: BANK DETAILS (Passive) */}
              <div className={styles.bankColumn}>
                <h3>1. Realiza tu Transferencia</h3>
                <p className={styles.stepDesc}>Haz tu aportación a nuestra cuenta común.</p>
                
                <div className={styles.ibanCard}>
                   <div className={styles.ibanHeader}>
                     <div className={styles.bankIcon}><Gift size={20}/></div>
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

              {/* RIGHT: PLEDGE FORM (Active) */}
              <div className={styles.pledgeColumn}>
                <h3>2. Registra tu Regalo</h3>
                <p className={styles.stepDesc}>¡Déjanos tu mensaje y el importe para el gráfico!</p>
                
                <form className={styles.pledgeForm} onSubmit={(e) => { e.preventDefault(); alert("¡Gracias! Tu aportación ha sido registrada en nuestro corazón (y en el gráfico próximamente)."); }}>
                  <div className={styles.inputGroup}>
                    <label>Tu Nombre</label>
                    <input type="text" placeholder="Ej: Tía Paqui" required className={styles.input} />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>Importe del Regalo (€)</label>
                    <input type="number" placeholder="Ej: 170" min="1" required className={styles.input} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Mensaje</label>
                    <textarea placeholder="¡Disfrutad mucho chicos!" rows={2} className={styles.textarea} />
                  </div>

                  <button type="submit" className={styles.pledgeBtn}>
                    <Check size={18} /> Registrar Aportación
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
