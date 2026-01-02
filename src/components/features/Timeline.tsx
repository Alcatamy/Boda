"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Heart, Music, Camera, Utensils, Sparkles } from "lucide-react";
import styles from "./Timeline.module.css";

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  icon: React.ReactNode;
  type: "ceremony" | "reception" | "party" | "dinner" | "photos";
  countdown?: boolean;
}

const weddingTimeline: TimelineEvent[] = [
  {
    id: "1",
    time: "16:30",
    title: "Llegada de Invitados",
    description: "Bienvenida y acomodación en la Ermita",
    location: "Ermita Ntra. Sra. de los Remedios",
    icon: <Heart size={20} />,
    type: "ceremony",
    countdown: true
  },
  {
    id: "2",
    time: "17:00",
    title: "Ceremonia Civil",
    description: "Unión de nuestras vidas ante la ley y nuestros seres queridos",
    location: "Ermita Ntra. Sra. de los Remedios",
    icon: <Heart size={20} />,
    type: "ceremony"
  },
  {
    id: "3",
    time: "17:45",
    title: "Fotos Familiares",
    description: "Capturando momentos especiales con nuestros seres queridos",
    location: "Jardines de la Ermita",
    icon: <Camera size={20} />,
    type: "photos"
  },
  {
    id: "4",
    time: "18:30",
    title: "Cóctel de Bienvenida",
    description: "Brindis y canapés mientras llegamos a la celebración",
    location: "Hacienda Mityana",
    icon: <Utensils size={20} />,
    type: "reception"
  },
  {
    id: "5",
    time: "20:00",
    title: "Cena",
    description: "Banquete celebrando nuestro amor",
    location: "Salón Principal - Hacienda Mityana",
    icon: <Utensils size={20} />,
    type: "dinner"
  },
  {
    id: "6",
    time: "22:30",
    title: "Corte de Tarta",
    description: "El dulce comienzo de nuestra nueva vida juntos",
    location: "Salón Principal - Hacienda Mityana",
    icon: <Heart size={20} />,
    type: "party"
  },
  {
    id: "7",
    time: "23:00",
    title: "¡Fiesta!",
    description: "Baile, música y celebración hasta el amanecer",
    location: "Pista de Baile - Hacienda Mityana",
    icon: <Music size={20} />,
    type: "party"
  },
  {
    id: "8",
    time: "02:00",
    title: "Fin de Fiesta",
    description: "El comienzo de nuestra eterna aventura",
    location: "Hacienda Mityana",
    icon: <Sparkles size={20} />,
    type: "party"
  }
];

export default function Timeline() {
  const [currentEventIndex, setCurrentEventIndex] = useState<number | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<{ hours: number; minutes: number } | null>(null);

  useEffect(() => {
    const updateCurrentEvent = () => {
      const now = new Date();
      const weddingDay = new Date("2026-07-25");
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Find current or next event
      let currentIdx = null;
      let nextEventTime = null;
      
      for (let i = 0; i < weddingTimeline.length; i++) {
        const [hours, minutes] = weddingTimeline[i].time.split(':').map(Number);
        const eventTime = hours * 60 + minutes;
        
        if (currentTime <= eventTime) {
          currentIdx = i;
          nextEventTime = eventTime;
          break;
        }
      }
      
      setCurrentEventIndex(currentIdx);
      
      if (nextEventTime !== null) {
        const minutesUntil = nextEventTime - currentTime;
        const hours = Math.floor(minutesUntil / 60);
        const minutes = minutesUntil % 60;
        setTimeUntilNext({ hours, minutes });
      } else {
        setTimeUntilNext(null);
      }
    };

    updateCurrentEvent();
    const interval = setInterval(updateCurrentEvent, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case "ceremony": return "#c5a059";
      case "reception": return "#3b82f6";
      case "party": return "#ef4444";
      case "dinner": return "#10b981";
      case "photos": return "#8b5cf6";
      default: return "#64748b";
    }
  };

  const getEventGradient = (type: TimelineEvent['type']) => {
    const color = getEventColor(type);
    return `linear-gradient(135deg, ${color}22, ${color}11)`;
  };

  return (
    <section className={styles.timelineSection} id="timeline">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>Itinerario del Día</h2>
          <p className={styles.subtitle}>
            Cada momento cuenta en nuestra celebración
          </p>
          
          {timeUntilNext && currentEventIndex !== null && (
            <motion.div
              className={styles.nextEvent}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Clock size={16} />
              <span>
                Próximo evento en {timeUntilNext.hours}h {timeUntilNext.minutes}min
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className={styles.timeline}>
          <div className={styles.timelineLine} />
          
          {weddingTimeline.map((event, index) => (
            <motion.div
              key={event.id}
              className={`${styles.timelineItem} ${
                currentEventIndex === index ? styles.currentEvent : ''
              } ${
                currentEventIndex !== null && index < currentEventIndex ? styles.pastEvent : ''
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div 
                className={styles.timelineDot}
                style={{ 
                  backgroundColor: getEventColor(event.type),
                  boxShadow: `0 0 20px ${getEventColor(event.type)}44`
                }}
              >
                <div className={styles.timelineIcon}>
                  {event.icon}
                </div>
              </div>
              
              <motion.div
                className={styles.timelineContent}
                style={{ background: getEventGradient(event.type) }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.eventTime}>
                  <Clock size={14} />
                  <span>{event.time}</span>
                </div>
                
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDescription}>{event.description}</p>
                
                <div className={styles.eventLocation}>
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
                
                {event.countdown && currentEventIndex === index && (
                  <motion.div
                    className={styles.liveIndicator}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className={styles.liveDot} />
                    <span>EN VIVO</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.timelineFooter}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className={styles.footerContent}>
            <Heart size={24} className={styles.footerIcon} />
            <p className={styles.footerText}>
              Gracias por ser parte de cada momento especial
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
