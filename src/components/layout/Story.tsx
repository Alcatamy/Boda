"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import styles from "./Story.module.css";

export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scrollytelling hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  return (
    <section className={styles.storySection} ref={containerRef}>
      <div className="container">
        <motion.div style={{ opacity, y }} className={styles.contentWrapper}>
          <div className={styles.textColumn}>
            <h2 className={styles.heading}>Nuestra Historia</h2>
            <p className={styles.paragraph}>
              Todo comenzó con una coincidencia inesperada en el centro de Madrid. 
              Lo que empezó como un café casual se convirtió en horas de conversación 
              que no queríamos que terminaran.
            </p>
            <p className={styles.paragraph}>
              Cinco años, innumerables viajes y mil recuerdos después, estamos listos 
              para escribir nuestro capítulo más importante hasta ahora. Queremos compartir 
              este día con las personas que han sido parte de nuestro viaje.
            </p>
          </div>
          
          <div className={styles.imageColumn}>
             <div className={styles.imageFrame}>
                <Image
                  src="/images/story-1.jpg"
                  alt="Nuestra Historia"
                  width={600}
                  height={800}
                  className={styles.image}
                  style={{ objectFit: "cover" }}
                />
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
