"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import styles from "./MessagesTicker.module.css";

type Message = {
    sender_name: string;
    content: string;
};

export default function MessagesTicker() {
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        // Fetch initial
        const fetchMessages = async () => {
            const { data } = await supabase
                .from("messages")
                .select("sender_name, content")
                .order("created_at", { ascending: false })
                .limit(20);

            if (data) setMessages(data);
        };

        fetchMessages();

        // Subscribe
        const channel = supabase
            .channel("realtime messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    setMessages((prev) => [payload.new as Message, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || messages.length === 0) return;

        let animationFrameId: number;
        let scrollSpeed = 0.5; // Pixels per frame (adjust for speed)

        const animateScroll = () => {
            if (!isPaused && scrollContainer) {
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    // Reset to start (seamless loop requires content duplication, 
                    // or just let it loop if we duplicate content enough. 
                    // For simplicity with user control, we'll just scroll locally.
                    // If we want infinite seamless, we need to reset scrollLeft.
                    // Let's rely on standard scroll. If end reached, maybe bounce or reset?
                    // Simple infinite effect:
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            }
            animationFrameId = requestAnimationFrame(animateScroll);
        };

        animationFrameId = requestAnimationFrame(animateScroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, messages]); // Re-run if paused changes

    if (messages.length === 0) {
        return <p className={styles.empty}>Sé el primero en dejarnos un mensaje ❤️</p>;
    }

    // Duplicate messages to ensure scrolling feel if few messages, 
    // or for the infinite loop limit trick.
    const displayMessages = messages.length > 5 ? [...messages, ...messages] : [...messages, ...messages, ...messages, ...messages];

    return (
        <div className={styles.tickerContainer}>
            <div className={styles.wrapper}>
                <div
                    className={styles.scrollTrack}
                    ref={scrollRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => {
                        // Small delay to prevent jitter before resuming
                        setTimeout(() => setIsPaused(false), 2000);
                    }}
                >
                    {displayMessages.map((msg, idx) => (
                        <div key={idx} className={styles.ticketItem}>
                            <p className={styles.message}>"{msg.content}"</p>
                            <span className={styles.author}>— {msg.sender_name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
