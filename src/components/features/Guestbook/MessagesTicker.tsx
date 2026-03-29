"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Heart } from "lucide-react";
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

    const animationRef = useRef<number>(0);

    useEffect(() => {
        // Fetch initial messages from the messages table
        const fetchMessages = async () => {
            const { data } = await supabase
                .from("messages")
                .select("sender_name, content, created_at")
                .order("created_at", { ascending: false })
                .limit(15);

            if (data) {
                const formatted = data.map(m => ({
                    sender_name: m.sender_name,
                    content: m.content as string,
                    created_at: m.created_at
                }));
                // Filter out empty strings just in case
                setMessages(formatted.filter(m => m.content && m.content.trim() !== ""));
            }
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel("realtime messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    const newMsg = payload.new;
                    if (newMsg.content && newMsg.content.trim() !== "") {
                        const newMessage: Message = {
                            sender_name: newMsg.sender_name,
                            content: newMsg.content,
                            created_at: newMsg.created_at
                        };
                        setMessages((prev) => [newMessage, ...prev.slice(0, 14)]);
                    }
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
                const children = scrollContainer.children;
                if (children.length > 0) {
                    // Calculate exact width of one full set of messages
                    const firstItem = children[0] as HTMLElement;
                    const middleItem = children[Math.floor(children.length / 2)] as HTMLElement;
                    const loopWidth = middleItem.offsetLeft - firstItem.offsetLeft;
                    
                    if (scrollContainer.scrollLeft >= loopWidth) {
                        // Instant reset to create a seamless loop without smooth-scroll fighting
                        scrollContainer.scrollLeft -= loopWidth;
                    } else if (scrollContainer.scrollLeft < 0) {
                         // if manually scrolled backwards past 0
                        scrollContainer.scrollLeft += loopWidth;
                    } else {
                        scrollContainer.scrollLeft += 1; // Default fixed speed
                    }
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [isPaused, isDragging, messages.length]);

    useEffect(() => {
        startAutoScroll();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [startAutoScroll]);



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



    if (messages.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Heart size={32} className={styles.emptyIcon} />
                <p className={styles.emptyText}>Sé el primero en dejarnos un mensaje ❤️</p>
            </div>
        );
    }

    // Create a seamless loop by duplicating messages array multiple times 
    // to ensure there's enough content to wrap smoothly on very wide screens
    const displayMessages = [...messages, ...messages, ...messages, ...messages];

    return (
        <div className={styles.tickerContainer}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <Heart size={20} className={styles.titleIcon} />
                    <h3 className={styles.title}>Mensajes de Nuestros Invitados</h3>
                </div>
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
                                <p className={styles.message}>&quot;{msg.content}&quot;</p>
                                <div className={styles.messageFooter}>
                                    <span className={styles.author}>— {msg.sender_name}</span>
                                    <Heart size={12} className={styles.heartIcon} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}
