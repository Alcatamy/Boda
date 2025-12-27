"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, MapPin, Calendar } from "lucide-react";
import AddToCalendar from "@/components/features/AddToCalendar";
import styles from "./Logistics.module.css";

export default function Logistics() {
  const schedule = [
    { time: "18:00", event: "Ceremonia Religiosa" },
    { time: "20:00", event: "Cóctel de Bienvenida" },
    { time: "21:30", event: "Banquete" },
    { time: "00:00", event: "Baile y Fiesta" },
    { time: "04:00", event: "Fin de Fiesta" },
  ];

  return (
    <section id="logistics" className={styles.section}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.header}
        >
          <h2 className={styles.title}>Detalles del Evento</h2>
          <p className={styles.subtitle}>Acompáñanos en Colmenar Viejo</p>
        </motion.div>

        <div className={styles.grid}>
          {/* Schedule Column */}
          <motion.div 
             className={styles.card}
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className={styles.cardHeader}>
              <Clock className={styles.icon} size={32} />
              <h3>Itinerario</h3>
            </div>
            
            <ul className={styles.scheduleList}>
              {schedule.map((item, index) => (
                <li key={index} className={styles.scheduleItem}>
                  <span className={styles.time}>{item.time}</span>
                  <span className={styles.event}>{item.event}</span>
                </li>
              ))}
            </ul>
             <div className={styles.visualcontext}>
                <Image 
                  src="/images/location-chapel.png" 
                  alt="Ermita" 
                  width={400} 
                  height={250} 
                  className={styles.locationImage}
                />
                <p className={styles.imageCaption}>Ermita Ntra. Sra. de los Remedios</p>
             </div>
          </motion.div>

          {/* Location Column */}
          <motion.div 
             className={styles.card}
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className={styles.cardHeader}>
              <MapPin className={styles.icon} size={32} />
              <h3>Ubicaciones</h3>
            </div>
             
            <div className={styles.locationDetails}>
              <h4>Ceremonia (18:00h)</h4>
              <p><strong>Ermita de Ntra. Sra. de los Remedios</strong></p>
              <p className={styles.address}>Carretera de Guadalix, Km 4.5, Colmenar Viejo</p>
              
              <div style={{ margin: '1.5rem 0', borderTop: '1px solid var(--color-border)' }} />

              <h4>Celebración (20:00h)</h4>
              <p><strong>Hacienda Mityana</strong></p>
              <p className={styles.address}>Carretera M-607 km 37.8, Colmenar Viejo</p>

              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.mapButton}
                style={{ marginTop: '1rem' }}
              >
                Ver Mapa
              </a>
            </div>
            
            <div className={styles.transportInfo}>
              <Calendar className={styles.smallIcon} size={20} />
              <p>Sábado, 25 de Julio de 2026</p>
            </div>

            <div className={styles.separador} style={{ margin: '1.5rem 0', borderTop: '1px solid var(--color-border)' }} />

            <div className={styles.contactInfo} style={{ textAlign: 'center' }}>
               <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Contacto</h4>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nadia: 646 46 14 47</p>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Adrián: 691 77 22 32</p>
            </div>
            
            <div style={{ marginTop: "2rem" }}>
              <AddToCalendar />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
