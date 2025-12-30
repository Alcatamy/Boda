"use client";

import { useEffect, useState } from "react";
import styles from "./MobileActionBar.module.css";
import Link from "next/link";

export default function MobileActionBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={styles.bar}>
            <Link href="#rsvp" className={styles.rsvpBtn}>
                Confirmar Asistencia
            </Link>
            <a
                href="https://www.google.com/maps/search/?api=1&query=Hacienda+Mityana"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
                aria-label="Ver Mapa"
            >
                📍
            </a>
        </div>
    );
}
