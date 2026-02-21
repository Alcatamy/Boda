"use client";

import { motion } from "framer-motion";
import styles from "./Story.module.css";
import OptimizedImage from "@/components/ui/OptimizedImage";

const storyPhotos = [
  // Paragraph 1 (0 to 5)
  "/images/story/Historia 1-0.jpg",
  "/images/story/Historia 1-1.jpg",
  "/images/story/Historia 1-2.jpg",
  "/images/story/Historia 1-3.jpg",
  "/images/story/Historia 1-4.jpg",
  // Paragraph 2 (5 to 11)
  "/images/story/Historia 2-0.jpg",
  "/images/story/Historia 2-1.jpg",
  "/images/story/Historia 2-2.jpg",
  "/images/story/Historia 2-3.jpg",
  "/images/story/Historia 2-4.jpg",
  "/images/story/Historia 2-5.jpg",
  // Paragraph 3 (11 to 17)
  "/images/story/Historia 3-0.jpg",
  "/images/story/Historia 3-1.jpg",
  "/images/story/Historia 3-2.jpg",
  "/images/story/Historia 3-3.jpg",
  "/images/story/Historia 3-4.jpg",
  "/images/story/Historia 3-5.jpg",
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

const renderPhotos = (start: number, end: number) => (
  <div className={styles.polaroidContainer}>
    {storyPhotos.slice(start, end).map((photo, i) => {
      const index = start + i;
      return (
        <motion.div
           key={index}
           className={styles.polaroid}
           initial={{ opacity: 0, scale: 0.8, y: 50 }}
           whileInView={{ opacity: 1, scale: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
           style={{
             transform: `rotate(${getRotation(index)}deg)`,
             marginTop: `${getMarginTop(index)}px`
           }}
         >
           <div className={styles.tape} />
           <div className={styles.polaroidImageWrapper}>
             <OptimizedImage
               src={photo}
               alt={`Historia - ${index}`}
               fill
               sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 15vw"
               className={styles.polaroidImage}
             />
           </div>
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
          <p className={styles.subtitle}>11 años de amor que nos llevarán al sí</p>
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

          {renderPhotos(0, 5)}

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

          {renderPhotos(5, 11)}

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

          {renderPhotos(11, 17)}

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

          {/* Note: User did not specify photos after paragraph 4, so no renderPhotos(17, X) is needed */}
        </div>
      </div>
    </section>
  );
}
