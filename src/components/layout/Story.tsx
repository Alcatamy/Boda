"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Story.module.css";
import OptimizedImage from "@/components/ui/OptimizedImage";

const storyPhotos = [
  "/images/story/0-2015.JPG",
  "/images/story/1-2015.jpg",
  "/images/story/2-2015.JPG",
  "/images/story/3-2016.JPG",
  "/images/story/4-2016.JPG",
  "/images/story/5-2017.jpg",
  "/images/story/6-2016.jpg",
  "/images/story/7-2018.jpg",
  "/images/story/8-2018.jpg",
  "/images/story/8.1-2020.jpg",
  "/images/story/9-2020.jpg",
  "/images/story/10-2021.jpg",
  "/images/story/11-2021.jpg",
  "/images/story/12-2022.jpg",
  "/images/story/13-2023.jpg",
  "/images/story/14-2023.jpg",
  "/images/story/15-2023.jpg",
  "/images/story/16-2023.jpg",
  "/images/story/17-2024.jpg",
  "/images/story/18-2024.jpg",
  "/images/story/19-2025.jpg",
  "/images/story/20-2025.jpg",
  "/images/story/21-2025.jpg",
];

export default function Story() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (selectedPhoto) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedPhoto, closeLightbox]);

  const renderPhotos = (start: number, end: number, gridClass?: string) => (
    <div className={`${styles.imageGrid} ${gridClass ? styles[gridClass] : ""}`}>
      {storyPhotos.slice(start, end).map((photo, i) => {
        const index = start + i;
        return (
          <motion.div
            key={index}
            className={styles.imageWrapper}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: (i % 5) * 0.08 }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <OptimizedImage
              src={photo}
              alt={`Historia - ${index}`}
              fill
              sizes="(max-width: 768px) 35vw, 150px"
              className={styles.image}
            />
          </motion.div>
        );
      })}
    </div>
  );

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
          <div className={styles.decorativeLine} />
        </motion.div>

        {/* Narrative Text & Photos Interleaved */}
        <div className={styles.narrativeContainer}>
          <motion.div
            className={styles.narrativeText}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p>
              Todo comenzó en una entrega de premios de bádminton, el deporte que nos vio crecer. Fue una coincidencia que sembró la semilla de lo que vendría después.
            </p>
          </motion.div>

          {/* 6 photos → 3+3 layout */}
          {renderPhotos(0, 6, "grid3cols")}

          <motion.div
            className={styles.narrativeText}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p>
              Dos años después, el pabellón volvió a cruzar nuestros caminos. Aunque una hora de distancia separaba nuestras casas, decidimos apostar por lo que sentíamos. Fueron muchos kilómetros recorridos, pero cada viaje mereció la pena.
            </p>
          </motion.div>

          {renderPhotos(6, 11)}

          <motion.div
            className={styles.narrativeText}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p>
              Desde la adolescencia hasta hoy, hemos crecido juntos en todos los sentidos. No solo en años, sino como personas. Nos hemos apoyado en cada etapa, celebrando logros y superando retos, siempre de la mano. Construyendo día a día lo que somos hoy.
            </p>
          </motion.div>

          {/* 7 photos → 4+3 layout */}
          {renderPhotos(11, 18, "grid4cols")}

          <motion.div
            className={styles.narrativeText}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p>
              En 2024 dimos un paso importante: estrenamos nuestro primer hogar juntos. Y ahora, tras 11 años de camino, el 25 de Julio de 2026 daremos el paso de unirnos para siempre, rodeados de toda la gente que nos quiere.
            </p>
          </motion.div>

          {renderPhotos(18, 23)}
        </div>
      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            <motion.div
              className={styles.lightboxContent}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto}
                alt="Foto ampliada"
                className={styles.lightboxImage}
              />
            </motion.div>
            <button
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
