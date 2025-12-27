"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    // Simulate loading time (or wait for resources)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset";
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.preloader}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={styles.content}
          >
            <h1 className={styles.initials}>N & A</h1>
            <div className={styles.line} />
            <p className={styles.date}>25 . 07 . 2026</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
