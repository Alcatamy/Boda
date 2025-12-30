"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Hero.module.css";
import Countdown from "@/components/features/Countdown/Countdown";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className={styles.hero}>
      {/* Background Image with Overlay */}
      <div className={styles.imageWrapper}>
        <motion.div style={{ y, height: "120%", position: "relative", width: "100%" }} className={styles.parallaxWrapper}>
          {/* Image removed as per user request */}
        </motion.div>
        <div className={styles.overlay} />
      </div>

      {/* Hero Content */}
      <motion.div
        className={styles.content}
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className={styles.titleWrapper}
        >
          <h2 className={styles.subtitle}>Reserva la Fecha</h2>
          <h1 className={styles.title}>Nadia & Adrián</h1>
          <p className={styles.date}>25 de Julio, 2026 • Colmenar Viejo, Madrid</p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Countdown />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className={styles.scrollIndicator}
        >
          <span>Desliza para explorar</span>
          <div className={styles.line} />
        </motion.div>
      </motion.div>
    </section>
  );
}
