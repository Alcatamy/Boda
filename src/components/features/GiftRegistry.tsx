"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Gift } from "lucide-react";
import styles from "./GiftRegistry.module.css";

export default function GiftRegistry() {
  const [copied, setCopied] = useState(false);
  const iban = "ES98 0000 0000 0000 0000 0000"; // Placeholder
  const concept = "Boda Adriana y Adrián";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="registry" className={styles.section}>
      <div className="container">
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.header}>
            <Gift className={styles.icon} size={32} />
            <h2 className={styles.title}>Lista de Boda</h2>
            <p className={styles.text}>
              Vuestra presencia es nuestro mayor regalo. No obstante, si queréis tener un detalle con nosotros, podéis hacerlo a través de la siguiente cuenta:
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.details}>
              <span className={styles.label}>NÚMERO DE CUENTA (IBAN)</span>
              <div className={styles.ibanRow}>
                <code className={styles.iban}>{iban}</code>
                <button 
                  onClick={copyToClipboard} 
                  className={styles.copyBtn}
                  aria-label="Copiar IBAN"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            <div className={styles.details}>
               <span className={styles.label}>CONCEPTO</span>
               <p className={styles.value}>{concept}</p>
            </div>
            
            {copied && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.toast}
              >
                ¡IBAN copiado!
              </motion.div>
            )}
          </div>
          
          <p className={styles.thankYou}>¡Gracias por vuestro cariño!</p>
        </motion.div>
      </div>
    </section>
  );
}
