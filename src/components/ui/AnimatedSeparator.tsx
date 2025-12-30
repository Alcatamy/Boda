"use client";

import { motion } from "framer-motion";
import styles from "./AnimatedSeparator.module.css";

export default function AnimatedSeparator({ inverted = false }: { inverted?: boolean }) {
    return (
        <div className={styles.separatorContainer}>
            <motion.div
                className={styles.line}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className={`${styles.diamond} ${inverted ? styles.diamondInverted : ''}`} />
            </motion.div>
        </div>
    );
}
