"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Plane, Gift, Camera, BedDouble, Lock, Info, Star } from "lucide-react";
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

  const experiences = [
    {
      icon: <Star size={24} />,
      title: "Cena en Crucero",
      desc: "Navegando por la Bahía de Ha Long al atardecer.",
    },
    {
      icon: <Camera size={24} />,
      title: "Recuerdos Eternos",
      desc: "Sesión de fotos en los templos de Bali.",
    },
    {
      icon: <BedDouble size={24} />,
      title: "Noches de Ensueño",
      desc: "Estancia en una Villa privada en Ubud. ¡Relax!",
    },
  ];

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
              Vuestra presencia es nuestro mayor regalo. Sin embargo, si deseáis ayudarnos a comenzar nuestra aventura juntos, podéis contribuir a nuestro viaje soñado por el Sudeste Asiático.
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
                <span className={styles.progressLabel}>Estado del viaje</span>
                <span className={styles.progressValue}>75%</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* EXPERIENCES GRID */}
        <div className={styles.experiencesSection}>
          <h3 className={styles.sectionTitle}>¿En qué invertiremos vuestro regalo?</h3>
          <p className={styles.sectionSubtitle}>Queremos ser transparentes. Ya tenemos tostadora. Lo que más ilusión nos hace es vivir experiencias únicas.</p>
          
          <div className={styles.grid}>
            {experiences.map((exp, i) => (
              <motion.div 
                key={i}
                className={styles.experienceCard}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.expIcon}>{exp.icon}</div>
                <div>
                  <h4 className={styles.expTitle}>{exp.title}</h4>
                  <p className={styles.expDesc}>{exp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CONTRIBUTE SECTION */}
        <div className={styles.contributeSection}>
          <div className={styles.headerCentered}>
            <span className={styles.smallTag}>HAZ TU REGALO</span>
            <h2 className={styles.titleLarge}>Contribuye a la Aventura</h2>
            <p className={styles.textMuted}>Elige la forma más cómoda para ti. Todo va directo a nuestro fondo común.</p>
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
