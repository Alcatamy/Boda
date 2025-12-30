"use client";

import { motion } from "framer-motion";
import styles from "./MessagesTicker.module.css";

const messages = [
    { text: "¡Qué seáis muy felices pareja!", author: "Tía Paqui" },
    { text: "No me pierdo este fiestón por nada.", author: "Primo Javi" },
    { text: "Os deseamos todo el amor del mundo. ❤️", author: "Familia García" },
    { text: "¡Vivan los novios!", author: "Tus amigos del gym" },
    { text: "Deseando veros en el altar.", author: "Carmen y Luis" },
    { text: "Va a ser un día inolvidable.", author: "Marta" },
];

export default function MessagesTicker() {
    return (
        <div className={styles.tickerContainer}>
            <div className={styles.wrapper}>
                <motion.div
                    className={styles.track}
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    {[...messages, ...messages, ...messages].map((msg, idx) => (
                        <div key={idx} className={styles.ticketItem}>
                            <p className={styles.message}>"{msg.text}"</p>
                            <span className={styles.author}>— {msg.author}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
