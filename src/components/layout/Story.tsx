"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Calendar, MapPin, Home } from "lucide-react";
import styles from "./Story.module.css";
import OptimizedImage from "@/components/ui/OptimizedImage";

// All photos provided by user, ordered chronologically from oldest to newest
const storyPhotos = [
  "/images/story/IMAG0216.jpg",           // Oldest (undated, likely early)
  "/images/story/IMG_0876.JPG",           // Early iPhone era
  "/images/story/IMG_1188.JPG",           // Early iPhone era
  "/images/story/IMG_2676.JPG",           // Early iPhone era
  "/images/story/IMG_2677.JPG",           // Early iPhone era
  "/images/story/20161015_154819.jpg",    // Oct 2016
  "/images/story/20180128_134305.jpg",    // Jan 2018
  "/images/story/20181207_190537.jpg",    // Dec 2018
  "/images/story/20190627_141615.jpg",    // Jun 2019
  "/images/story/IMG_20200726_001303.jpg",// Jul 2020
  "/images/story/nueva-foto-10.jpg",      // ~2020 (10th oldest)
  "/images/story/IMG_20201225_192843.jpg",// Dec 2020
  "/images/story/IMG_20210828_182808.jpg",// Aug 2021
  "/images/story/IMG_20210901_172706.jpg",// Sep 2021
  "/images/story/IMG20220413173554.jpg",  // Apr 2022
  "/images/story/original_a799f9b5-f0d3-48b5-b4a1-f84180b69000_IMG20230724192453.jpg", // Jul 2023
  "/images/story/IMG20230820135606.jpg",  // Aug 2023
  "/images/story/IMG20230920174425.jpg",  // Sep 2023
  "/images/story/IMG20231231233127.jpg",  // Dec 2023
  "/images/story/AirBrush_20240529135359.jpg", // May 2024
  "/images/story/PXL_20250801_103322546.jpg",  // Aug 2025
  "/images/story/PXL_20250803_100301502.jpg",  // Aug 2025
];

export default function Story() {
  // Timeline milestones with photos
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

        {/* Desktop: Two rows layout */}
        <div className={styles.desktopLayout}>
          {/* First Row - Timeline with photos */}
          <div className={styles.timelineRow}>
            {timelineMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className={styles.timelineItem}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div 
                  className={styles.timelineDot}
                  style={{ backgroundColor: milestone.color }}
                >
                  <div className={styles.timelineIcon}>
                    {milestone.icon}
                  </div>
                </div>
                
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineYear}>{milestone.year}</span>
                    <h3 className={styles.timelineTitle}>{milestone.title}</h3>
                  </div>
                  
                  <p className={styles.timelineDescription}>
                    {milestone.description}
                  </p>
                  
                  <div className={styles.photoStrip}>
                    {milestone.photos.slice(0, 3).map((photo, photoIndex) => (
                      <motion.div
                        key={photoIndex}
                        className={styles.stripPhoto}
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <OptimizedImage
                          src={photo}
                          alt={`Historia ${milestone.id}-${photoIndex}`}
                          fill
                          sizes="100px"
                          className={styles.stripImage}
                        />
                      </motion.div>
                    ))}
                    {milestone.photos.length > 3 && (
                      <div className={styles.morePhotos}>
                        +{milestone.photos.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second Row - Photo Gallery */}
          <div className={styles.galleryRow}>
            <motion.div
              className={styles.galleryGrid}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {storyPhotos.slice(0, 12).map((photo, index) => (
                <motion.div
                  key={index}
                  className={styles.galleryPhoto}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05 
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    zIndex: 10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                >
                  <OptimizedImage
                    src={photo}
                    alt={`Galería ${index}`}
                    fill
                    sizes="(max-width: 768px) 25vw, 150px"
                    className={styles.galleryImage}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className={styles.mobileLayout}>
          {timelineMilestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              className={styles.mobileMilestone}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={styles.mobileHeader}>
                <div 
                  className={styles.mobileDot}
                  style={{ backgroundColor: milestone.color }}
                >
                  {milestone.icon}
                </div>
                <div className={styles.mobileTitleSection}>
                  <span className={styles.mobileYear}>{milestone.year}</span>
                  <h3 className={styles.mobileTitle}>{milestone.title}</h3>
                </div>
              </div>
              
              <p className={styles.mobileDescription}>
                {milestone.description}
              </p>
              
              <div className={styles.mobileGallery}>
                {milestone.photos.map((photo, photoIndex) => (
                  <motion.div
                    key={photoIndex}
                    className={styles.mobilePhoto}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OptimizedImage
                      src={photo}
                      alt={`Móvil ${milestone.id}-${photoIndex}`}
                      fill
                      sizes="80px"
                      className={styles.mobileImage}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
