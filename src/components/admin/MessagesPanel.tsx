"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Trash2 } from "lucide-react";
import styles from "./MessagesPanel.module.css";

interface Message {
  id: string;
  sender_name: string;
  content: string;
  created_at: string;
  source: "messages" | "guests";
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: msgData, error: msgError } = await supabase
          .from("messages")
          .select("id, sender_name, content, created_at")
          .order("created_at", { ascending: false });

        const { data: gstData, error: gstError } = await supabase
          .from("guests")
          .select("id, first_name, message, created_at")
          .not("message", "is", null)
          .neq("message", "");

        if (msgError) console.error("Supabase Error fetch msgs:", msgError);
        if (gstError) console.error("Supabase Error fetch guests:", gstError);

        let combined: Message[] = [];

        if (msgData) {
          combined = [...combined, ...msgData.map(m => ({
            id: m.id,
            sender_name: m.sender_name,
            content: m.content as string,
            created_at: m.created_at,
            source: "messages" as const
          }))];
        }

        if (gstData) {
          combined = [...combined, ...gstData.map(m => ({
            id: m.id,
            sender_name: m.first_name,
            content: m.message as string,
            created_at: m.created_at,
            source: "guests" as const
          }))];
        }

        combined.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });

        setMessages(combined.filter(m => m.content && m.content.trim() !== ""));
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id: string, source: "messages" | "guests") => {
    if (window.confirm("¿Seguro que quieres borrar este mensaje? Esta acción no se puede deshacer.")) {
      try {
        if (source === "messages") {
           const { error } = await supabase.from('messages').delete().eq('id', id);
           if (error) throw error;
        } else {
           const { error } = await supabase.from('guests').update({ message: null }).eq('id', id);
           if (error) throw error;
        }
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error al borrar el mensaje.');
      }
    }
  };

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
                <button
                  onClick={() => handleDelete(msg.id, msg.source)}
                  className={styles.deleteButton}
                  title="Borrar mensaje"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
