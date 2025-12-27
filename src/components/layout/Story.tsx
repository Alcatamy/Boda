"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import styles from "./Story.module.css";

const timelineEvents = [
  {
    year: "2015",
    title: "El Encuentro",
    description: "Nuestros caminos se cruzaron por primera vez en una entrega de premios de bádminton, el deporte que nos vio crecer. Una coincidencia que sembró la semilla de lo que vendría.",
    image: "/images/story/2016.jpg" // Using closest era photo
  },
  {
    year: "2017",
    title: "El Destino",
    description: "Dos años después, el pabellón nos volvió a unir. A pesar de los 60 minutos de distancia que nos separaban, decidimos apostar por nosotros y comenzar este viaje juntos.",
    image: "/images/story/2018.jpg"
  },
  {
    year: "2021",
    title: "Creciendo de la Mano",
    description: "De estudiantes a profesionales. Hemos madurado juntos, apoyándonos en cada examen, cada logro y cada paso hacia la vida adulta. 11 años construyendo quienes somos hoy.",
    image: "/images/story/2020.jpg"
  },
  {
    year: "2024",
    title: "Nuestro Hogar",
    description: "Nueve años después de aquel primer encuentro, cumplimos uno de nuestros mayores sueños: tener nuestro propio hogar. Un refugio construido con esfuerzo y mucho amor.",
    image: "/images/story/2023.jpg"
  },
  {
    year: "2026",
    title: "Sí, Para Siempre",
    description: "El 25 de Julio daremos el paso más importante. Queremos celebrar con vosotros que el amor, cuando se cuida y se trabaja en equipo, es la mayor victoria de todas.",
    image: "/images/story/2025.jpg"
  }
];

export default function Story() {
  return (
    <section className={styles.storySection} id="story">
      <div className="container">
        <motion.h2 
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Nuestra Historia
        </motion.h2>

        <div className={styles.timeline}>
          {timelineEvents.map((event, index) => (
            <TimelineItem key={event.year} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image: string;
}

function TimelineItem({ event, index }: { event: TimelineEvent, index: number }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const x = useTransform(
    scrollYProgress, 
    [0, 0.5], 
    [isEven ? -50 : 50, 0]
  );
  
  // Stagger Text from opposite side
  const textX = useTransform(
    scrollYProgress, 
    [0, 0.5], 
    [isEven ? 50 : -50, 0]
  );

  return (
    <div ref={ref} className={styles.timelineItem}>
      <div className={`${styles.timelineRow} ${!isEven ? styles.reverse : ''}`}>
        
        {/* IMAGE SIDE */}
        <motion.div style={{ opacity, x }} className={styles.imageCol}>
          <div className={styles.imageWrapper}>
            <div className={styles.yearOverlay}>{event.year}</div>
            <Image
              src={event.image}
              alt={event.title}
              fill
              className={styles.storyImage}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>

        {/* CENTER MARKER */}
        <motion.div 
           initial={{ scale: 0 }}
           whileInView={{ scale: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className={styles.marker} 
        />

        {/* TEXT SIDE */}
        <motion.div style={{ opacity, x: textX }} className={styles.textCol}>
          <h3 className={styles.title}>{event.title}</h3>
          <p className={styles.description}>{event.description}</p>
        </motion.div>

      </div>
    </div>
  );
}
