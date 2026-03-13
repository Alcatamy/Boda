"use client";

import { motion } from "framer-motion";
import styles from "./Story.module.css";
import OptimizedImage from "@/components/ui/OptimizedImage";

const storyPhotos = [
  "/images/story/2016.jpg",
  "/images/story/20161015_154819.jpg",
  "/images/story/2018.jpg",
  "/images/story/20180128_134305.jpg",
  "/images/story/20181207_190537.jpg",
  "/images/story/20190627_141615.jpg",
  "/images/story/2020.jpg",
  "/images/story/2023.jpg",
  "/images/story/2025.jpg",
  "/images/story/hero-foto.png",
  "/images/story/nueva-foto-10.jpg",
  "/images/story/AirBrush_20240529135359.jpg",
  "/images/story/IMAG0216.jpg",
  "/images/story/IMG-20251228-WA0020.jpg",
  "/images/story/IMG20220413173554.jpg",
  "/images/story/IMG20230820135606.jpg",
  "/images/story/IMG20230920174425.jpg",
  "/images/story/IMG20231231233127.jpg",
  "/images/story/IMG_0876.JPG",
  "/images/story/IMG_1188.JPG",
  "/images/story/IMG_20200726_001303.jpg",
  "/images/story/IMG_20201225_192843.jpg",
  "/images/story/IMG_20210828_182808.jpg",
  "/images/story/IMG_20210901_172706.jpg",
  "/images/story/IMG_2676.JPG",
  "/images/story/IMG_2677.JPG",
  "/images/story/PXL_20250801_103322546.jpg",
  "/images/story/PXL_20250803_100301502.jpg",
  "/images/story/PXL_20250807_183346256.jpg",
  "/images/story/PXL_20251004_161539984.jpg",
  "/images/story/original_a799f9b5-f0d3-48b5-b4a1-f84180b69000_IMG20230724192453.jpg",
];

const renderPhotos = (start: number, end: number) => (
  <div className={styles.imageGrid}>
    {storyPhotos.slice(start, end).map((photo, i) => {
      const index = start + i;
      return (
        <motion.div
          key={index}
          className={styles.imageWrapper}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
        >
          <OptimizedImage
            src={photo}
            alt={`Historia - ${index}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={styles.image}
          />
        </motion.div>
      );
    })}
  </div>
);

export default function Story() {
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

          {renderPhotos(0, 8)}

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

          {renderPhotos(8, 16)}

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

          {renderPhotos(16, 24)}

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

          {renderPhotos(24, 31)}
        </div>
      </div>
    </section>
  );
}
