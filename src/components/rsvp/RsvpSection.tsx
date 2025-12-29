"use client";

import { motion } from "framer-motion";
import RsvpForm from "./RsvpForm";
import styles from "./RsvpSection.module.css";

export default function RsvpSection() {
  return (
    <section id="rsvp" className={styles.section}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.header}
        >
          <span className={styles.label}>Reserva tu lugar</span>
          <h2 className={styles.title}>Confirma tu Asistencia</h2>
          <p className={styles.description}>
            Por favor, confirma tu asistencia antes del 25 de Abril de 2026 para ayudarnos a organizar todo perfectamente.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <RsvpForm />
        </motion.div>
      </div>
    </section>
  );
}
