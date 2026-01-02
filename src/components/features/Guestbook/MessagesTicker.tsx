"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Heart, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./MessagesTicker.module.css";

type Message = {
    sender_name: string;
    content: string;
    created_at?: string;
};

export default function MessagesTicker() {
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [autoScrollSpeed, setAutoScrollSpeed] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const animationRef = useRef<number>();

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            const { data } = await supabase
                .from("messages")
                .select("sender_name, content, created_at")
                .order("created_at", { ascending: false })
                .limit(15);

            if (data) setMessages(data);
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel("realtime messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    setMessages((prev) => [payload.new as Message, ...prev.slice(0, 14)]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Auto-scroll with smooth animation
    const startAutoScroll = useCallback(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || messages.length === 0) return;

        const animate = () => {
            if (!isPaused && !isDragging && scrollContainer) {
                const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                
                if (scrollContainer.scrollLeft >= maxScroll) {
                    // Smooth reset to start
                    scrollContainer.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    scrollContainer.scrollLeft += autoScrollSpeed;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [isPaused, isDragging, autoScrollSpeed, messages.length]);

    useEffect(() => {
        startAutoScroll();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [startAutoScroll]);

    // Manual scroll controls
    const handleManualScroll = (direction: 'left' | 'right') => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollAmount = 300;
        const newScrollLeft = direction === 'left' 
            ? Math.max(0, scrollContainer.scrollLeft - scrollAmount)
            : Math.min(scrollContainer.scrollWidth - scrollContainer.clientWidth, scrollContainer.scrollLeft + scrollAmount);

        scrollContainer.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    // Mouse drag functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
        setIsPaused(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setTimeout(() => setIsPaused(false), 2000); // Resume auto-scroll after 2 seconds
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // Touch events for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
        setIsPaused(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !scrollRef.current) return;
        
        const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setTimeout(() => setIsPaused(false), 2000);
    };

    // Speed control
    const adjustSpeed = (delta: number) => {
        setAutoScrollSpeed(prev => Math.max(0.5, Math.min(5, prev + delta)));
    };

    if (messages.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Heart size={32} className={styles.emptyIcon} />
                <p className={styles.emptyText}>Sé el primero en dejarnos un mensaje ❤️</p>
            </div>
        );
    }

    // Create seamless loop by duplicating messages
    const displayMessages = [...messages, ...messages];

    return (
        <div 
            className={styles.tickerContainer}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <Heart size={20} className={styles.titleIcon} />
                    <h3 className={styles.title}>Mensajes de Nuestros Invitados</h3>
                </div>
                
                <AnimatePresence>
                    {showControls && (
                        <motion.div
                            className={styles.controls}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <button
                                className={styles.controlBtn}
                                onClick={() => setIsPaused(!isPaused)}
                                title={isPaused ? "Reanudar" : "Pausar"}
                            >
                                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                            </button>
                            
                            <div className={styles.speedControls}>
                                <button
                                    className={styles.speedBtn}
                                    onClick={() => adjustSpeed(-0.5)}
                                    title="Disminuir velocidad"
                                >
                                    -
                                </button>
                                <span className={styles.speedIndicator}>{autoScrollSpeed.toFixed(1)}x</span>
                                <button
                                    className={styles.speedBtn}
                                    onClick={() => adjustSpeed(0.5)}
                                    title="Aumentar velocidad"
                                >
                                    +
                                </button>
                            </div>
                            
                            <button
                                className={styles.controlBtn}
                                onClick={() => handleManualScroll('left')}
                                title="Anterior"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            
                            <button
                                className={styles.controlBtn}
                                onClick={() => handleManualScroll('right')}
                                title="Siguiente"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className={styles.wrapper}>
                <div
                    className={`${styles.scrollTrack} ${isDragging ? styles.dragging : ''}`}
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    {displayMessages.map((msg, idx) => (
                        <motion.div
                            key={`${msg.sender_name}-${idx}`}
                            className={styles.messageItem}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <div className={styles.messageContent}>
                                <p className={styles.message}>"{msg.content}"</p>
                                <div className={styles.messageFooter}>
                                    <span className={styles.author}>— {msg.sender_name}</span>
                                    <Heart size={12} className={styles.heartIcon} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className={styles.footer}>
                <span className={styles.footerText}>
                    {isPaused ? "Pausado" : "Desplazamiento automático"} • 
                    {messages.length} mensajes • 
                    Arrastra para navegar más rápido
                </span>
            </div>
        </div>
    );
}
