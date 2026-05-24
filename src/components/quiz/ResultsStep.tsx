"use client";

import React, { useEffect, useState } from "react";
import styles from "./Quiz.module.css";
import { Share2, Award, Trophy, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { quizQuestions } from "@/lib/quiz-questions";

interface ResultsStepProps {
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  playerName: string;
  groupName: string;
  onSaveScore: () => Promise<void>;
  onRestart: () => void;
  onViewLeaderboard: () => void;
  isSavingScore: boolean;
  scoreSaved: boolean;
  selectedAnswers: number[];
}

export default function ResultsStep({
  score,
  totalQuestions,
  timeTaken,
  playerName,
  groupName,
  onSaveScore,
  onRestart,
  onViewLeaderboard,
  isSavingScore,
  scoreSaved,
  selectedAnswers
}: ResultsStepProps) {
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Trigger epic confetti on mount
  useEffect(() => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#c5a059", "#e7e5e4", "#ffd700"]
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#c5a059", "#e7e5e4", "#ffd700"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  }, []);

  const getBadgeDetails = (pts: number) => {
    if (pts <= 3) {
      return {
        title: "Invitado de relleno 🙈",
        desc: "¡Oye! ¿Seguro que no te has equivocado de boda? Sabes quiénes son de milagro. ¡Acércate a la barra a hablar con ellos!"
      };
    } else if (pts <= 7) {
      return {
        title: "Conocido decente 🧐",
        desc: "Conoces lo básico sobre Adrián y Nadia, pero te falta un poco de cotilleo. ¡Aprovecha el banquete para ponerte al día!"
      };
    } else if (pts <= 11) {
      return {
        title: "Amigo de verdad 🥳",
        desc: "¡Muy buena puntuación! Los conoces bastante bien. Te has ganado el derecho a pedir una canción en el DJ y un chupito extra."
      };
    } else if (pts <= 14) {
      return {
        title: "Círculo Íntimo 💖",
        desc: "¡Espectacular! Eres parte de su día a día y conoces sus secretos y manías. Casi, casi compartes cepillo de dientes con ellos."
      };
    } else {
      return {
        title: "Padrino/Madrina Supremo/a 👑",
        desc: "¡15 de 15! ¡Increíble! Sabes más sobre Adrián y Nadia que sus propias madres. Has alcanzado la iluminación nupcial."
      };
    }
  };

  const badge = getBadgeDetails(score);

  // Format time taken
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    const message = `¡He sacado ${score}/${totalQuestions} en el quiz de la boda de Nadia y Adrián! Mi título honorífico es "${badge.title}" 🏆. ¿Puedes superarme? Juega en: ${window.location.origin}/quiz`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleManualConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className={`${styles.resultsContainer} ${styles.fadeIn}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>¡Quiz Completado!</h1>
        <p className={styles.subtitle}>Resultados para {playerName}</p>
      </div>

      {/* Score display */}
      <div 
        className={styles.scoreCircle} 
        onClick={handleManualConfetti} 
        title="¡Haz clic para lanzar más confeti!"
        style={{ cursor: "pointer" }}
      >
        <span className={styles.scoreNumber}>{score}</span>
        <span className={styles.scoreTotal}>de {totalQuestions}</span>
      </div>

      <div style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
        Tiempo empleado: <strong>{formatTime(timeTaken)}</strong>
      </div>

      {/* Badge Award */}
      <div className={styles.badgeTitle}>
        <Award size={20} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem", color: "var(--color-primary-gold)" }} />
        {badge.title}
      </div>
      <p className={styles.badgeDescription}>
        {badge.desc}
      </p>

      {/* Action panel */}
      <div className={styles.resultsActions}>
        {!scoreSaved ? (
          <button
            onClick={onSaveScore}
            disabled={isSavingScore}
            className={styles.btnPrimary}
            type="button"
          >
            <Trophy size={18} /> {isSavingScore ? "Guardando..." : "Subir al Ranking"}
          </button>
        ) : (
          <button
            onClick={onViewLeaderboard}
            className={styles.btnPrimary}
            type="button"
            style={{ backgroundColor: "#4caf50" }}
          >
            <Trophy size={18} /> ¡Puntuación Subida! Ver Ranking
          </button>
        )}

        <button
          onClick={handleShareWhatsApp}
          className={styles.btnSecondary}
          type="button"
        >
          <Share2 size={18} /> Compartir en WhatsApp
        </button>

        <button
          onClick={onRestart}
          className={styles.btnSecondary}
          type="button"
        >
          <RotateCcw size={18} /> Repetir
        </button>
      </div>

      {/* Review Answers Collapsible */}
      <div style={{ marginTop: "2rem", width: "100%", borderTop: "1px dashed var(--color-border)", paddingTop: "2.5rem" }}>
        <button
          type="button"
          onClick={() => setShowReview(!showReview)}
          className={styles.btnSecondary}
          style={{ width: "100%", justifyContent: "center", marginBottom: "1.5rem" }}
        >
          {showReview ? "Ocultar Respuestas Correctas 🔼" : "Ver Respuestas Correctas 🔽"}
        </button>

        {showReview && (
          <div className={styles.fadeIn} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", textAlign: "left", marginBottom: "2.5rem" }}>
            {quizQuestions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              
              return (
                <div key={q.id} style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-md)",
                  border: isCorrect ? "1px solid rgba(76, 175, 80, 0.25)" : "1px solid rgba(244, 67, 54, 0.25)",
                  background: isCorrect ? "rgba(76, 175, 80, 0.02)" : "rgba(244, 67, 54, 0.02)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.01)"
                }}>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 500, marginBottom: "0.5rem", color: "var(--color-text-charcoal)" }}>
                    {q.id}. {q.question}
                  </h4>
                  
                  <div style={{ fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.6rem" }}>
                    <div style={{ color: isCorrect ? "#2e7d32" : "#c62828", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span>Tu respuesta:</span>
                      <strong>{q.options[userAns] !== undefined ? q.options[userAns] : "Sin respuesta"}</strong>
                      <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{isCorrect ? "✓" : "✗"}</span>
                    </div>
                    
                    {!isCorrect && (
                      <div style={{ color: "#2e7d32", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span>Respuesta correcta:</span>
                        <strong>{q.options[q.correctAnswer]}</strong>
                      </div>
                    )}
                  </div>
                  
                  <div style={{
                    fontSize: "0.85rem",
                    color: "var(--color-text-muted)",
                    padding: "0.6rem 0.8rem",
                    background: "rgba(197, 160, 89, 0.06)",
                    borderRadius: "4px",
                    borderLeft: "2px solid var(--color-primary-gold)"
                  }}>
                    💡 {q.funFact}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
