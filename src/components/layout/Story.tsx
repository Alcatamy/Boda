"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, MapPin, Home } from "lucide-react";
import styles from "./Story.module.css";
import OptimizedImage from "@/components/ui/OptimizedImage";

const storyPhotos = [
  "/images/story/IMAG0216.jpg",
  "/images/story/IMG_0876.JPG",
  "/images/story/IMG_1188.JPG",
  "/images/story/IMG_2676.JPG",
  "/images/story/IMG_2677.JPG",
  "/images/story/20161015_154819.jpg",
  "/images/story/20180128_134305.jpg",
  "/images/story/20181207_190537.jpg",
  "/images/story/20190627_141615.jpg",
  "/images/story/IMG_20200726_001303.jpg",
  "/images/story/nueva-foto-10.jpg",
  "/images/story/IMG_20201225_192843.jpg",
  "/images/story/IMG_20210828_182808.jpg",
  "/images/story/IMG_20210901_172706.jpg",
  "/images/story/IMG20220413173554.jpg",
  "/images/story/original_a799f9b5-f0d3-48b5-b4a1-f84180b69000_IMG20230724192453.jpg",
  "/images/story/IMG20230820135606.jpg",
  "/images/story/IMG20230920174425.jpg",
  "/images/story/IMG20231231233127.jpg",
  "/images/story/AirBrush_20240529135359.jpg",
  "/images/story/PXL_20250801_103322546.jpg",
  "/images/story/PXL_20250803_100301502.jpg",
];

// Deterministic pseudo-random values for design
const getRotation = (index: number) => {
  const rotations = [-6, 4, -3, 7, -5, 6, -4, 3, -7, 5];
  return rotations[index % rotations.length];
};

const getMarginTop = (index: number) => {
  const margins = [0, 40, 10, 50, -10, 30, -20, 20, -15, 60];
  return margins[index % margins.length];
};

export default function Story() {
  const timelineMilestones = [
    {
      id: 1,
      year: "2013",
      title: "El Comienzo",
      icon: <Heart size={20} />,
      description: "Todo comenzó en una entrega de premios de bádminton, el deporte que nos vio crecer. Fue una coincidencia que sembró la semilla de lo que vendría después.",
      photos: storyPhotos.slice(0, 5),
      color: "#ef4444"
    },
    {
      id: 2,
      year: "2015",
      title: "La Decisión",
      icon: <MapPin size={20} />,
      description: "Dos años después, el pabellón volvió a cruzar nuestros caminos. Aunque una hora de distancia separaba nuestras casas, decidimos apostar por lo que sentíamos.",
      photos: storyPhotos.slice(5, 11),
      color: "#3b82f6"
    },
    {
      id: 3,
      year: "2016-2023",
      title: "Creciendo Juntos",
      icon: <Calendar size={20} />,
      description: "Desde la adolescencia hasta hoy, hemos crecido juntos en todos los sentidos. Nos hemos apoyado en cada etapa, celebrando logros y superando retos.",
      photos: storyPhotos.slice(11, 17),
      color: "#10b981"
    },
    {
      id: 4,
      year: "2024-2026",
      title: "El Futuro",
      icon: <Home size={20} />,
      description: "En 2024 dimos un paso importante: estrenamos nuestro primer hogar juntos. Y ahora, tras 11 años de camino, el 25 de Julio de 2026 daremos el paso de unirnos para siempre.",
      photos: storyPhotos.slice(17),
      color: "#c5a059"
    }
  ];

  return (
    <section className={styles.storySection} id="story">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>Nuestra Historia</h2>
          <p className={styles.subtitle}>11 años de amor que nos llevarán al sí</p>
          <div className={styles.decorativeLine} />
        </motion.div>

        <div className={styles.milestonesList}>
          {timelineMilestones.map((milestone, milestoneIndex) => (
            <div key={milestone.id} className={styles.milestoneBlock}>
              {/* Texto de la historia */}
              <motion.div
                className={styles.milestoneText}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.milestoneYearBadge} style={{ color: milestone.color }}>
                  <span className={styles.milestoneIconWrapper} style={{ backgroundColor: milestone.color }}>
                      {milestone.icon}
                  </span>
                  {milestone.year}
                </div>
                <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                <p className={styles.milestoneDesc}>{milestone.description}</p>
              </motion.div>

              {/* Polaroids correspondientes a esta etapa */}
              <div className={styles.polaroidContainer}>
                {milestone.photos.map((photo, index) => {
                  // Generate a unique index across all photos for rotation deterministic pseudo-random
                  const globalIndex = milestoneIndex * 10 + index;
                  return (
                    <motion.div
                      key={index}
                      className={styles.polaroid}
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                      style={{
                        transform: `rotate(${getRotation(globalIndex)}deg)`,
                        marginTop: `${getMarginTop(globalIndex)}px`
                      }}
                    >
                      <div className={styles.tape} />
                      <div className={styles.polaroidImageWrapper}>
                        <OptimizedImage
                          src={photo}
                          alt={`Historia ${milestone.title} - ${index}`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className={styles.polaroidImage}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {milestoneIndex < timelineMilestones.length - 1 && (
                 <div className={styles.milestoneDivider} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
