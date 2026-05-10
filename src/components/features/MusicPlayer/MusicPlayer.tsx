"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./MusicPlayer.module.css";

export default function MusicPlayer({ autoPlay }: { autoPlay: boolean }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [recommendation, setRecommendation] = useState({ name: "", song: "" });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (autoPlay && audioRef.current) {
            audioRef.current.volume = 0.5;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => {/* autoplay blocked, user must interact */});
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

    const handleRecommend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError("");

        try {
            const { error: dbError } = await supabase
                .from("song_requests")
                .insert({
                    sender_name: recommendation.name.trim(),
                    song_artist: recommendation.song.trim(),
                    status: "pending",
                });

            if (dbError) throw dbError;

            setSent(true);
            setTimeout(() => {
                setIsExpanded(false);
                setSent(false);
                setRecommendation({ name: "", song: "" });
            }, 2500);
        } catch (err) {
            console.error("Error saving song request:", err);
            setError("No se pudo guardar. Intentalo de nuevo.");
        } finally {
            setSending(false);
        }
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
                                <h3>Musica Maestro</h3>
                                <button onClick={() => setIsExpanded(false)}><X size={18} /></button>
                            </div>

                            <div className={styles.nowPlaying}>
                                <button onClick={togglePlay} className={styles.playBtn}>
                                    {isPlaying
                                        ? <Pause size={20} fill="currentColor" />
                                        : <Play size={20} fill="currentColor" />}
                                </button>
                                <div className={styles.trackInfo}>
                                    <span className={styles.trackTitle}>Adventure of a Lifetime</span>
                                    <span className={styles.trackArtist}>Coldplay</span>
                                </div>
                            </div>

                            <div className={styles.requestForm}>
                                <h4>Que cancion no debe faltar?</h4>
                                {sent ? (
                                    <div className={styles.successMsg}>
                                        <Heart size={16} fill="red" color="red" /> Anotada! Gracias
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
                                            disabled={sending}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cancion / Artista"
                                            required
                                            className={styles.inputMini}
                                            value={recommendation.song}
                                            onChange={e => setRecommendation({ ...recommendation, song: e.target.value })}
                                            disabled={sending}
                                        />
                                        {error && <p className={styles.errorMsg}>{error}</p>}
                                        <button
                                            type="submit"
                                            className={styles.submitBtn}
                                            disabled={sending}
                                        >
                                            {sending ? <Loader2 size={16} className={styles.spinIcon} /> : "Enviar"}
                                        </button>
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
