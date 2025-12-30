"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./EnvelopeIntro.module.css";

export default function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVanishing, setIsVanishing] = useState(false);

    // NOTE: Autoplay often requires user interaction first. Clicking the envelope serves as that interaction.

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Trigger the actual site reveal after animation
        setTimeout(() => {
            setIsVanishing(true);
            setTimeout(() => {
                onOpen();
            }, 800);
        }, 1500); // Wait for flap to open
    };

    if (isVanishing) return null;

    return (
        <motion.div
            className={styles.overlay}
            exit={{ opacity: 0, scale: 1.5, pointerEvents: "none" }}
            transition={{ duration: 1 }}
        >
            <div className={styles.envelopeContainer} onClick={handleOpen}>
                <motion.div
                    className={styles.envelope}
                    animate={isOpen ? { translateY: 100, opacity: 0 } : {}}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    {/* FLAPS */}
                    <div className={styles.flapLeft} />
                    <div className={styles.flapRight} />
                    <div className={styles.flapBottom} />

                    <motion.div
                        className={styles.flapTop}
                        animate={isOpen ? { rotateX: 180, zIndex: 1 } : { rotateX: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />

                    {/* SEAL */}
                    <motion.div
                        className={styles.seal}
                        animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        N&A
                    </motion.div>

                    <div className={styles.envelopeText}>
                        Para Ti
                    </div>
                </motion.div>

                {!isOpen && (
                    <div className={styles.clickHint}>
                        Toca para abrir
                    </div>
                )}
            </div>
        </motion.div>
    );
}
