"use client";

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return (
    <div className={styles.wrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={styles.chatWindow}
          >
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <Sparkles size={18} className={styles.icon} />
                <span>Concierge AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.messages}>
              {messages.length === 0 && (
                <div className={styles.emptyState}>
                  <p>¡Hola! Soy el asistente virtual de la boda.</p>
                  <p>¿En qué puedo ayudarte hoy?</p>
                </div>
              )}
              
              {messages.map((m: any) => (
                <div key={m.id} className={`${styles.message} ${m.role === 'user' ? styles.user : styles.ai}`}>
                  {m.content}
                </div>
              ))}
              
              {isLoading && (
                 <div className={`${styles.message} ${styles.ai}`}>
                    <span className={styles.dots}>...</span>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className={styles.inputArea}>
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Pregunta sobre horarios, dress code..."
                className={styles.input}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className={styles.sendBtn}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={styles.fab}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
