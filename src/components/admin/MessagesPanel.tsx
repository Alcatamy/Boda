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
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("id, sender_name, content, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que quieres borrar este mensaje? Esta acción no se puede deshacer.")) {
      try {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) throw error;
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
                  onClick={() => handleDelete(msg.id)}
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
