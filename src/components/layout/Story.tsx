"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Story.module.css";

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
                Todo comenzó con una coincidencia inesperada en una entrega de premios de bádminton, el deporte que nos vio crecer. 
                Aunque nuestras caminos se habían cruzado antes, fue esa noche cuando sembramos la semilla de lo que vendría.
              </p>
              <br />
              <p>
                Dos años después, el destino nos volvió a unir en el pabellón. A pesar de los 60 minutos de distancia que nos separaban, 
                decidimos apostar por nosotros. Fueron años de viajes, videollamadas y kilómetros recorridos con ilusión.
              </p>
              <br />
              <p>
                Hemos crecido de la mano. Pasamos de ser estudiantes con sueños a adultos construyendo una realidad juntos. 
                Nos hemos apoyado en cada examen, en cada logro laboral y en cada desafío de la vida adulta.
              </p>
              <br />
              <p>
                En 2024 cumplimos uno de nuestros mayores sueños: nuestro propio hogar. Un refugio construido con esfuerzo y mucho amor. 
                Y ahora, tras 11 años de camino compartido, el 25 de Julio de 2026 daremos el paso más importante: unirnos para siempre, 
                rodeados de la gente que nos quiere.
              </p>
            </div>
          </motion.div>

          {/* Photo Grid Column */}
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
