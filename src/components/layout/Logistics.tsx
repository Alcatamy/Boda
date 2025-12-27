"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, MapPin, Calendar } from "lucide-react";
import AddToCalendar from "@/components/features/AddToCalendar";
import styles from "./Logistics.module.css";

export default function Logistics() {
  const schedule = [
    { time: "17:30", event: "Llegada de invitados" },
    { time: "18:00", event: "Ceremonia Civil" },
    { time: "19:00", event: "Cóctel de Bienvenida" },
    { time: "21:00", event: "Cena de Gala" },
    { time: "23:30", event: "Baile y Fiesta" },
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
          <p className={styles.subtitle}>Todo lo que necesitas saber para nuestro gran día</p>
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
            {/* Added visual context if needed, otherwise keeping list clean */}
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
                <p className={styles.imageCaption}>Ceremonia en la Ermita</p>
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
              <h3>Ubicación</h3>
            </div>
             <Image 
                src="/images/location-estate.png" 
                alt="Finca El Gasco" 
                width={400} 
                height={250} 
                className={styles.locationImage}
             />
            <div className={styles.locationDetails}>
              <h4>Finca El Gasco</h4>
              <p>Torrelodones, Madrid</p>
              <p className={styles.address}>
                Dirección exacta disponible en Google Maps
              </p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.mapButton}
              >
                Ver en Mapa
              </a>
            </div>
            
            <div className={styles.transportInfo}>
              <Calendar className={styles.smallIcon} size={20} />
              <p>Habrá autobuses disponibles desde Plaza de España a las 16:30.</p>
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
