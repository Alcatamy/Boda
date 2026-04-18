"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare } from "lucide-react";
import styles from "./MessagesPanel.module.css";

interface Message {
  id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("guests")
          .select("id, first_name, message, created_at")
          .not("message", "is", null)
          .neq("message", "")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Map guests schema to Message interface
        const formattedMessages = (data || []).map(g => ({
            id: g.id,
            sender_name: g.first_name,
            content: g.message as string,
            created_at: g.created_at
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <span>Cargando mensajes...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <MessageSquare size={20} />
          <div>
            <span className={styles.statNumber}>{messages.length}</span>
            <span className={styles.statLabel}>Total mensajes</span>
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className={styles.emptyState}>
          <MessageSquare size={48} className={styles.emptyIcon} />
          <p>Aún no hay mensajes en el libro de visitas</p>
        </div>
      ) : (
        <div className={styles.messageList}>
          {messages.map((msg) => (
            <div key={msg.id} className={styles.messageCard}>
              <p className={styles.messageContent}>&quot;{msg.content}&quot;</p>
              <div className={styles.messageFooter}>
                <span className={styles.messageSender}>
                  — {msg.sender_name}
                </span>
                <span className={styles.messageDate}>
                  {new Date(msg.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
