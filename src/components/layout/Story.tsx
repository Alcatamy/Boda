"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Story.module.css";
import TiltWrapper from "@/components/ui/TiltWrapper";

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
  // Define content blocks for ZigZag layout
  const blocks = [
    {
      id: 1,
      text: `Todo comenzó en una entrega de premios de bádminton, el deporte que nos vio crecer. 
             Fue una coincidencia que sembró la semilla de lo que vendría después.`,
      photos: storyPhotos.slice(0, 3) // First 3 photos
    },
    {
      id: 2,
      text: `Dos años después, el pabellón volvió a cruzar nuestros caminos. Aunque una hora de distancia 
             separaba nuestras casas, decidimos apostar por lo que sentíamos. Fueron muchos kilómetros 
             recorridos, pero cada viaje mereció la pena.`,
      photos: storyPhotos.slice(3, 7) // Next 4 photos
    },
    {
      id: 3,
      text: `Desde el colegio hasta hoy, hemos crecido juntos en todos los sentidos. No solo en edad, 
             sino como personas. Nos hemos apoyado en cada etapa, celebrando logros y superando retos, 
             siempre de la mano. Construyendo día a día lo que somos hoy.`,
      photos: storyPhotos.slice(7, 13) // Next 6 photos
    },
    {
      id: 4,
      text: `En 2024 dimos un paso importante: estrenamos nuestro primer hogar juntos. Y ahora, tras 11 años de camino, 
             el 25 de Julio de 2026 daremos el paso de unirnos para siempre, rodeados de toda la gente que nos quiere.`,
      photos: storyPhotos.slice(13, 22) // Remaining photos
    }
  ];

  return (
    <section className={styles.storySection} id="story">
      <div className={styles.container}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Nuestra Historia
        </motion.h2>

        <div className={styles.zigzagWrapper}>
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              className={`${styles.row} ${index % 2 === 1 ? styles.rowReverse : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              {/* Text Side */}
              <div className={styles.textBlock}>
                <p className={styles.paragraph}>{block.text}</p>
                <div className={styles.decorativeLine} />
              </div>

              {/* Photo Side (Mini Grid) */}
              <div className={styles.photoBlock}>
                <div className={styles.miniGrid}>
                  {block.photos.map((src, i) => (
                    <TiltWrapper key={i} className={styles.miniPhotoItem}>
                      <Image
                        src={src}
                        alt={`Historia ${block.id}-${i}`}
                        fill
                        className={styles.storyImage}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </TiltWrapper>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
