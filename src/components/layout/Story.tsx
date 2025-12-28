"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Story.module.css";

// All photos provided by user, oldest to newest (chronological order)
const storyPhotos = [
  "/images/story/2016.jpg",
  "/images/story/2018.jpg",
  "/images/story/2020.jpg",
  "/images/story/2023.jpg",
  "/images/story/2025.jpg",
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
                Dos años más tarde, el pabellón nos volvió a unir. Pese a que vivíamos a <strong>una hora de distancia</strong> (entre la casa de mis padres y la tuya, ¡que se dice pronto!), 
                decidimos apostar por nosotros. Fueron muchos kilómetros, pero cada viaje valía la pena.
              </p>
              <br />
              <p>
                Hemos crecido de la mano. No solo en edad, sino como personas. Nos hemos apoyado en cada etapa, 
                celebrando logros y superando retos, siempre juntos. Construyendo día a día lo que somos hoy.
              </p>
              <br />
              <p>
                En 2024 cumplimos el sueño de nuestro propio hogar. Y ahora, tras 11 años de camino, 
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
