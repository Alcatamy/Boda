"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, MapPin, Bus, Phone, Calendar as CalendarIcon } from "lucide-react";
import AddToCalendar from "@/components/features/AddToCalendar";
import styles from "./Logistics.module.css";

export default function Logistics() {
  return (
    <section id="logistics" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.header}
        >
          <h2 className={styles.title}>Detalles del Evento</h2>
          <p className={styles.subtitle}>
            Una jornada inolvidable en el corazón de Colmenar Viejo.
            Aquí tenéis las coordenadas para acompañarnos.
          </p>
        </motion.div>

        <div className={styles.grid}>

          {/* CARD 1: CEREMONY */}
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.imageContainer}>
              <Image
                src="/images/venues/ceremonia.png"
                alt="Ermita de Nuestra Señora de los Remedios"
                fill
                className={styles.locationImage}
              />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <div className={styles.timeTag}>
                  <Clock size={16} /> 18:00
                </div>
                <h3 className={styles.cardTitle}>Sí, quiero</h3>
              </div>

              <div className={styles.details}>
                <span className={styles.locationName}>Ermita Ntra. Sra. de los Remedios</span>
                <span className={styles.address}>Carretera de Guadalix, Km 4.5<br />28770 Colmenar Viejo, Madrid</span>
              </div>

              <div className={styles.actions}>
                <a
                  href="https://maps.app.goo.gl/example" // TODO: Add real link
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapButton}
                >
                  <MapPin size={16} /> Ver en Mapa
                </a>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: CELEBRATION */}
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.imageContainer}>
              <Image
                src="/images/venues/fiesta.png"
                alt="Hacienda Mityana"
                fill
                className={styles.locationImage}
              />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <div className={styles.timeTag}>
                  <Clock size={16} /> 20:00
                </div>
                <h3 className={styles.cardTitle}>La Fiesta</h3>
              </div>

              <div className={styles.details}>
                <span className={styles.locationName}>Hacienda Mityana</span>
                <span className={styles.address}>Ctra. M-607, Km 37.8<br />28770 Colmenar Viejo, Madrid</span>
              </div>

              <div className={styles.actions}>
                <a
                  href="https://maps.app.goo.gl/example2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapButton}
                >
                  <MapPin size={16} /> Ver en Mapa
                </a>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: INFO */}
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className={styles.cardContent}>
              <div className={styles.iconBox}>
                <Phone size={32} />
              </div>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Información</h3>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Phone className={styles.infoIcon} size={20} />
                  <div>
                    <span className={styles.infoLabel}>Contacto</span>
                    <p className={styles.infoValue}>
                      Nadia: 646 46 14 47<br />
                      Adrián: 691 77 22 32
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <CalendarIcon className={styles.infoIcon} size={20} />
                  <div>
                    <span className={styles.infoLabel}>Fecha</span>
                    <p className={styles.infoValue}>Sábado 25 de Julio, 2026</p>
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <AddToCalendar />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
