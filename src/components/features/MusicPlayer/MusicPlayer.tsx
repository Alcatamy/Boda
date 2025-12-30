"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Music, X, Pause, Play, Heart } from "lucide-react";
import styles from "./MusicPlayer.module.css";

export default function MusicPlayer({ autoPlay }: { autoPlay: boolean }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Suggested Song State
    const [recommendation, setRecommendation] = useState({ name: "", song: "" });
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (autoPlay && audioRef.current) {
            // Attempt to play
            audioRef.current.volume = 0.5;
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.error("Autoplay prevented:", error);
                        // We could show a "Click to Play" toast here if needed
                    });
            }
        }
    }, [autoPlay]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleRecommend = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        // Here you would optimally save to DB
        setTimeout(() => {
            setIsExpanded(false);
            setSent(false);
            setRecommendation({ name: "", song: "" });
        }, 2000);
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="/music/Coldplay - Adventure of a Lifetime.mp3"
                loop
            />

            <motion.div
                className={styles.floater}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2 }}
            >
                {/* VINYL DISC */}
                <div className={styles.vinylContainer} onClick={() => setIsExpanded(!isExpanded)}>
                    <motion.div
                        className={styles.vinyl}
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                    >
                        <div className={styles.vinylGrooves} />
                        <div className={styles.vinylLabel} />
                    </motion.div>

                    <div className={styles.playOverlay}>
                        {isPlaying ? <span className={styles.equalizer} /> : <Play size={16} fill="white" />}
                    </div>
                </div>

                {/* EXPANDED PANEL */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className={styles.panel}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className={styles.panelHeader}>
                                <h3>Música Maestro</h3>
                                <button onClick={() => setIsExpanded(false)}><X size={18} /></button>
                            </div>

                            <div className={styles.nowPlaying}>
                                <button onClick={togglePlay} className={styles.playBtn}>
                                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                </button>
                                <div className={styles.trackInfo}>
                                    <span className={styles.trackTitle}>Adventure of a Lifetime</span>
                                    <span className={styles.trackArtist}>Coldplay</span>
                                </div>
                            </div>

                            <div className={styles.requestForm}>
                                <h4>¿Qué canción no debe faltar?</h4>
                                {sent ? (
                                    <div className={styles.successMsg}>
                                        <Heart size={16} fill="red" color="red" /> ¡Anotada! Gracias
                                    </div>
                                ) : (
                                    <form onSubmit={handleRecommend}>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            required
                                            className={styles.inputMini}
                                            value={recommendation.name}
                                            onChange={e => setRecommendation({ ...recommendation, name: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Canción / Artista"
                                            required
                                            className={styles.inputMini}
                                            value={recommendation.song}
                                            onChange={e => setRecommendation({ ...recommendation, song: e.target.value })}
                                        />
                                        <button type="submit" className={styles.sendBtn}>Enviar Sugerencia</button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
