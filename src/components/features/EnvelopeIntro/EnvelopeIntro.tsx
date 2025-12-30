"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./EnvelopeIntro.module.css";

export default function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isZooming, setIsZooming] = useState(false);

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Phase 2: Start zoom after flap opens
        setTimeout(() => {
            setIsZooming(true);
        }, 800);

        // Phase 3: Reveal site after zoom completes
        setTimeout(() => {
            onOpen();
        }, 2200);
    };

    return (
        <motion.div
            className={styles.overlay}
            animate={isZooming ? {
                opacity: 0
            } : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ pointerEvents: isZooming ? "none" : "auto" }}
        >
            <motion.div
                className={styles.envelopeContainer}
                onClick={handleOpen}
                animate={isZooming ? {
                    scale: 25,
                    opacity: 0
                } : { scale: 1 }}
                transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                <motion.div
                    className={styles.envelope}
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
                            duration: 1,
                            ease: [0.34, 1.56, 0.64, 1]
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                    />

                    {/* "Para Ti" - On the TOP FLAP area */}
                    <motion.div
                        className={styles.envelopeText}
                        animate={isOpen ? { opacity: 0, y: -20 } : { opacity: 1 }}
                        transition={{ duration: 0.3 }}
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
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        N&A
                    </motion.div>

                    {/* INNER CARD - Visible through the opening */}
                    <motion.div
                        className={styles.innerCard}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isOpen ? {
                            opacity: 1,
                            scale: 1
                        } : { opacity: 0, scale: 0.9 }}
                        transition={{
                            delay: 0.4,
                            duration: 0.6,
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
            </motion.div>
        </motion.div>
    );
}
