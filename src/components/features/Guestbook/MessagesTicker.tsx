"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import styles from "./MessagesTicker.module.css";

type Message = {
    sender_name: string;
    content: string;
};

export default function MessagesTicker() {
    const [messages, setMessages] = useState<Message[]>([]);

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

    if (messages.length === 0) {
        return <p className={styles.empty}>Sé el primero en dejarnos un mensaje ❤️</p>;
    }

    return (
        <div className={styles.tickerContainer}>
            <div className={styles.wrapper}>
                <div className={styles.scrollTrack}>
                    {[...messages].map((msg, idx) => (
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
