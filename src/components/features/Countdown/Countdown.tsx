"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Countdown.module.css";
import { Cormorant_Garamond } from "next/font/google";
import { Heart, Sparkles } from "lucide-react";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400"] });

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isAfterWedding, setIsAfterWedding] = useState(false);
    const [daysMarried, setDaysMarried] = useState(0);

    const weddingDate = new Date("2026-07-25T18:00:00").getTime();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                // After wedding - show days married
                setIsAfterWedding(true);
                const daysSinceWedding = Math.abs(Math.floor(distance / (1000 * 60 * 60 * 24)));
                setDaysMarried(daysSinceWedding);
                return;
            }

            // Before wedding - countdown
            setIsAfterWedding(false);
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Before wedding - countdown
    if (!isAfterWedding) {
        return (
            <div className={styles.container}>
                <motion.div 
                    className={styles.countdownWrapper}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={styles.timeBlock}>
                        <span className={`${styles.number} ${cormorant.className}`}>{timeLeft.days}</span>
                        <span className={styles.label}>Días</span>
                    </div>
                    <div className={styles.separator}>:</div>
                    <div className={styles.timeBlock}>
                        <span className={`${styles.number} ${cormorant.className}`}>{timeLeft.hours}</span>
                        <span className={styles.label}>Horas</span>
                    </div>
                    <div className={styles.separator}>:</div>
                    <div className={styles.timeBlock}>
                        <span className={`${styles.number} ${cormorant.className}`}>{timeLeft.minutes}</span>
                        <span className={styles.label}>Min</span>
                    </div>
                    <div className={styles.separator}>:</div>
                    <div className={styles.timeBlock}>
                        <span className={`${styles.number} ${cormorant.className}`}>{timeLeft.seconds}</span>
                        <span className={styles.label}>Seg</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    // After wedding - days married counter
    return (
        <motion.div 
            className={styles.marriedContainer}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className={styles.marriedContent}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={styles.heartIcon}
                >
                    <Heart size={32} fill="#c5a059" color="#c5a059" />
                </motion.div>
                <div className={styles.marriedText}>
                    <h3 className={`${styles.marriedTitle} ${cormorant.className}`}>
                        ¡Gracias por acompañarnos!
                    </h3>
                    <div className={styles.daysCounter}>
                        <span className={`${styles.daysNumber} ${cormorant.className}`}>{daysMarried}</span>
                        <span className={styles.daysLabel}>días de felicidad</span>
                    </div>
                    <div className={styles.sparkles}>
                        <Sparkles size={16} className={styles.sparkle} />
                        <span className={styles.sparkleText}>Y contando...</span>
                        <Sparkles size={16} className={styles.sparkle} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
