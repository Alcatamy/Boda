"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Story.module.css";

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
  "/images/story/IMG-20251228-WA0020.jpg",     // Dec 2025
];

export default function Story() {
  return (
    <section className={styles.storySection} id="story">
      <div className="container">
        <div className={styles.contentWrapper}>

          {/* Text Column */}
          <motion.div
            className={styles.textColumn}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.heading}>Nuestra Historia</h2>

            <div className={styles.narrativeText}>
              <p>
                Todo comenzó en una entrega de premios de bádminton, el deporte que nos vio crecer.
                Fue una coincidencia que sembró la semilla de lo que vendría después.
              </p>
              <br />
              <p>
                Dos años después, el pabellón volvió a cruzar nuestros caminos. Aunque una hora de distancia
                separaba nuestras casas, decidimos apostar por lo que sentíamos. Fueron muchos kilómetros
                recorridos, pero cada viaje mereció la pena.
              </p>
              <br />
              <p>
                Desde el colegio hasta hoy, hemos crecido juntos en todos los sentidos. No solo en edad,
                sino como personas. Nos hemos apoyado en cada etapa, celebrando logros y superando retos,
                siempre de la mano. Construyendo día a día lo que somos hoy.
              </p>
              <br />
              <p>
                En 2024 dimos un paso importante: estrenamos nuestro primer hogar juntos. Y ahora, tras 11 años de camino,
                el 25 de Julio de 2026 daremos el paso de unirnos para siempre, rodeados de toda la gente que nos quiere.
              </p>
            </div>
          </motion.div>

          {/* Photo Grid / Collage */}
          <motion.div
            className={styles.imageGrid}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {storyPhotos.map((src, index) => (
              <div key={index} className={styles.imageItem}>
                <Image
                  src={src}
                  alt={`Nuestra historia ${index + 1}`}
                  fill
                  className={styles.storyImage}
                  sizes="(max-width: 768px) 33vw, 15vw"
                />
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
