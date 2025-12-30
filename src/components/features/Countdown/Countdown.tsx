"use client";

import { useState, useEffect } from "react";
import styles from "./Countdown.module.css";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400"] });

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const weddingDate = new Date("2026-07-25T18:00:00").getTime();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.container}>
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
        </div>
    );
}
