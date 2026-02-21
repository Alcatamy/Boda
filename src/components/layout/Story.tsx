"use client";

import { motion } from "framer-motion";
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

        <div className={styles.polaroidContainer}>
          {storyPhotos.map((photo, index) => (
            <motion.div
              key={index}
              className={styles.polaroid}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
              style={{
                transform: `rotate(${getRotation(index)}deg)`,
                marginTop: `${getMarginTop(index)}px`
              }}
            >
              <div className={styles.tape} />
              <div className={styles.polaroidImageWrapper}>
                <OptimizedImage
                  src={photo}
                  alt={`Historia ${index}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className={styles.polaroidImage}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
