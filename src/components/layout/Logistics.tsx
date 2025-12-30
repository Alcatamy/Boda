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
                  href="https://www.google.com/maps/place/Ermita+de+Nuestra+Se%C3%B1ora+de+los+Remedios/@40.702771,-3.770035,843m/data=!3m1!1e3!4m6!3m5!1s0xd417ddb04c76de3:0xc5ece120765f6c35!8m2!3d40.7027937!4d-3.7697878!16s%2Fg%2F120n2v1_?entry=ttu"
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
                  href="https://www.google.com/maps/search/Hacienda+Mityana+Colmenar+Viejo+Carretera+M-607+Km+37.800"
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <Phone size={28} className={styles.accentIcon} />
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Información</h3>
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
