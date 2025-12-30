"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./EnvelopeIntro.module.css";

export default function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVanishing, setIsVanishing] = useState(false);

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Trigger the actual site reveal after dramatic animation
        setTimeout(() => {
            setIsVanishing(true);
            setTimeout(() => {
                onOpen();
            }, 1000); // Longer fade out
        }, 2000); // Wait for full animation
    };

    if (isVanishing) return null;

    return (
        <motion.div
            className={styles.overlay}
            exit={{ opacity: 0, scale: 1.2, pointerEvents: "none" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
        >
            <div className={styles.envelopeContainer} onClick={handleOpen}>
                <motion.div
                    className={styles.envelope}
                    animate={isOpen ? {
                        translateY: 50,
                        opacity: 0,
                        scale: 0.9
                    } : {}}
                    transition={{ delay: 1.2, duration: 0.8, ease: "easeInOut" }}
                >
                    {/* FLAPS */}
                    <div className={styles.flapLeft} />
                    <div className={styles.flapRight} />
                    <div className={styles.flapBottom} />

                    {/* TOP FLAP - Dramatic 180° 3D rotation */}
                    <motion.div
                        className={styles.flapTop}
                        animate={isOpen ? {
                            rotateX: 180
                        } : { rotateX: 0 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.34, 1.56, 0.64, 1] // Spring/bouncy physics
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                    />

                    {/* "Para Ti" - On the TOP FLAP area */}
                    <motion.div
                        className={styles.envelopeText}
                        animate={isOpen ? { opacity: 0, y: -20 } : { opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        Para Ti
                    </motion.div>

                    {/* WAX SEAL */}
                    <motion.div
                        className={styles.seal}
                        animate={isOpen ? {
                            opacity: 0,
                            scale: 0.3,
                            rotate: 45
                        } : { opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        N&A
                    </motion.div>

                    {/* INNER CARD - Emerges with scale effect */}
                    <motion.div
                        className={styles.innerCard}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={isOpen ? {
                            opacity: 1,
                            scale: 1.1,
                            y: -30
                        } : { opacity: 0, scale: 0.8, y: 20 }}
                        transition={{
                            delay: 0.6,
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >
                        <span className={styles.innerCardText}>Nadia & Adrián</span>
                        <span className={styles.innerCardSubtext}>25 de Julio, 2026</span>
                    </motion.div>
                </motion.div>

                {!isOpen && (
                    <motion.div
                        className={styles.clickHint}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        Toca para abrir
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
