"use client";

import React, { useState } from "react";
import styles from "./Quiz.module.css";
import { Play } from "lucide-react";
import Link from "next/link";

interface WelcomeStepProps {
  onStart: (name: string, group: string) => void;
  isLoadingLeaderboard: boolean;
  onViewLeaderboard: () => void;
}

export default function WelcomeStep({ onStart, isLoadingLeaderboard, onViewLeaderboard }: WelcomeStepProps) {
  const [name, setName] = useState("");
  const group = "Invitado";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    onStart(name.trim(), group);
  };

  return (
    <div className={`${styles.resultsContainer} ${styles.fadeIn}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>¿Quién conoce más a los novios?</h1>
        <p className={styles.subtitle}>El Quiz Oficial de la Boda de Nadia y Adrián</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.resultsContainer}>
        <p style={{ margin: "0 auto 2rem", fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
          Demuestra cuánto sabes sobre Adrián y Nadia respondiendo a 15 divertidas preguntas. ¡Entra en la tabla de clasificación y compite con el resto de invitados!
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="playerName" className={styles.label}>
            Tu Nombre y Apellido
          </label>
          <input
            type="text"
            id="playerName"
            placeholder="Ej. Carmen García"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
            minLength={2}
            maxLength={35}
            autoComplete="off"
          />
        </div>

        <div className={styles.resultsActions} style={{ marginTop: "2rem" }}>
          <button
            type="submit"
            disabled={name.trim().length < 2}
            className={styles.btnPrimary}
            style={{ opacity: name.trim().length < 2 ? 0.6 : 1, cursor: name.trim().length < 2 ? "not-allowed" : "pointer" }}
          >
            <Play size={18} fill="currentColor" /> Comenzar Quiz
          </button>

          <button
            type="button"
            onClick={onViewLeaderboard}
            disabled={isLoadingLeaderboard}
            className={styles.btnSecondary}
          >
            Ver Clasificación 🏆
          </button>
        </div>
      </form>
    </div>
  );
}
