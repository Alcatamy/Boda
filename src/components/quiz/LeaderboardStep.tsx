"use client";

import React, { useState, useEffect } from "react";
import styles from "./Quiz.module.css";
import { Trophy, ArrowLeft, RefreshCw, Award, Share2 } from "lucide-react";
import { quizQuestions } from "@/lib/quiz-questions";
import confetti from "canvas-confetti";

export interface ScoreEntry {
  player_name: string;
  group_name: string;
  score: number;
  total_questions: number;
  time_taken_seconds: number;
}

// Helper to extract 1 or 2 initials from playerName
const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const p1 = parts[0] ? parts[0][0] : "";
    const p2 = parts[1] ? parts[1][0] : "";
    return (p1 + p2).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Helper to generate a unique, colorful background for each player's avatar
const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  // A saturation of 70% and lightness of 50% yields highly vibrant colors readable with white text.
  return `hsl(${hue}, 70%, 50%)`;
};

// Helper to style group pills dynamically based on their category
const getGroupBadgeStyle = (group: string) => {
  const cleanGroup = group.toLowerCase().trim();
  
  if (cleanGroup.includes("nadia") || cleanGroup.includes("novia")) {
    return {
      backgroundColor: "rgba(244, 63, 94, 0.12)",
      color: "#f43f5e",
      border: "1px solid rgba(244, 63, 94, 0.25)"
    };
  }
  if (cleanGroup.includes("adrián") || cleanGroup.includes("adrian") || cleanGroup.includes("novio")) {
    return {
      backgroundColor: "rgba(14, 165, 233, 0.12)",
      color: "#0ea5e9",
      border: "1px solid rgba(14, 165, 233, 0.25)"
    };
  }
  if (cleanGroup.includes("familia")) {
    return {
      backgroundColor: "rgba(168, 85, 247, 0.12)",
      color: "#a855f7",
      border: "1px solid rgba(168, 85, 247, 0.25)"
    };
  }
  if (cleanGroup.includes("trabajo") || cleanGroup.includes("curro") || cleanGroup.includes("compañeros")) {
    return {
      backgroundColor: "rgba(234, 179, 8, 0.12)",
      color: "#eab308",
      border: "1px solid rgba(234, 179, 8, 0.25)"
    };
  }
  if (cleanGroup.includes("novios") || cleanGroup.includes("pareja")) {
    return {
      backgroundColor: "rgba(197, 160, 89, 0.12)",
      color: "#c5a059",
      border: "1px solid rgba(197, 160, 89, 0.25)"
    };
  }
  
  // Hash fallback for generic groups
  let hash = 0;
  for (let i = 0; i < group.length; i++) {
    hash = group.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    backgroundColor: `hsla(${hue}, 70%, 50%, 0.12)`,
    color: `hsl(${hue}, 80%, 50%)`,
    border: `1px solid hsla(${hue}, 70%, 50%, 0.25)`
  };
};

interface LeaderboardStepProps {
  scores: ScoreEntry[];
  currentUserScore?: {
    player_name: string;
    group_name: string;
    score: number;
    time_taken_seconds: number;
  };
  selectedAnswers?: number[];
  onBack: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function LeaderboardStep({
  scores,
  currentUserScore,
  selectedAnswers,
  onBack,
  onRefresh,
  isLoading
}: LeaderboardStepProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [showReview, setShowReview] = useState(false);

  // Trigger confetti once on load if current user just finished with a score
  useEffect(() => {
    if (currentUserScore) {
      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#c5a059", "#e7e5e4", "#ffd700"]
      });
    }
  }, [currentUserScore]);

  const uniqueGroups = Array.from(new Set(scores.map((s) => s.group_name)))
    .filter((g) => g && g.toLowerCase().trim() !== "invitado");

  // Filter scores based on selected group
  const filteredScores = selectedGroup === "all"
    ? scores
    : scores.filter((s) => s.group_name === selectedGroup);

  // Format time taken
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const getRankBadgeClass = (index: number) => {
    if (index === 0) return `${styles.rankBadge} ${styles.rank1}`;
    if (index === 1) return `${styles.rankBadge} ${styles.rank2}`;
    if (index === 2) return `${styles.rankBadge} ${styles.rank3}`;
    return `${styles.rankBadge} ${styles.rankOther}`;
  };

  const getBadgeDetails = (pts: number) => {
    if (pts <= 3) {
      return {
        title: "Invitado de relleno 🙈",
        desc: "¡Oye! ¿Seguro que no te has equivocado de boda? Sabes quiénes son de milagro. ¡Acércate a la barra y ponte al día!"
      };
    } else if (pts <= 7) {
      return {
        title: "Conocido decente 🧐",
        desc: "Conoces lo básico sobre Adrián y Nadia, pero te falta cotilleo. ¡Aprovecha el banquete para enterarte de más!"
      };
    } else if (pts <= 11) {
      return {
        title: "Amigo de verdad 🥳",
        desc: "¡Muy buena puntuación! Los conoces bastante bien. Te has ganado el derecho a pedir una canción al DJ y un chupito extra."
      };
    } else if (pts <= 14) {
      return {
        title: "Círculo Íntimo 💖",
        desc: "¡Espectacular! Eres parte de su día a día y conoces sus secretos y manías. ¡Casi compartes cepillo de dientes con ellos!"
      };
    } else {
      return {
        title: "Padrino/Madrina Supremo/a 👑",
        desc: "¡15 de 15! ¡Increíble! Sabes más sobre Adrián y Nadia que sus propias madres. Has alcanzado la iluminación nupcial."
      };
    }
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    if (!currentUserScore) return;
    const badge = getBadgeDetails(currentUserScore.score);
    const message = `¡He sacado ${currentUserScore.score}/15 en el quiz de la boda de Nadia y Adrián! Mi rango es "${badge.title}" 🏆. ¿Puedes superarme? Juega en: ${window.location.origin}/quiz`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleManualConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleClearLocalScores = () => {
    if (window.confirm("¿Seguro que quieres borrar todas las puntuaciones locales?")) {
      localStorage.removeItem("local_quiz_scores");
      onRefresh();
    }
  };

  return (
    <div className={styles.fadeIn}>
      {/* ─── CURRENT USER RESULTS HEADER (ONLY SHOWN IF JUST PLAYED) ─── */}
      {currentUserScore && (
        <div style={{
          textAlign: "center",
          borderBottom: "1px dashed var(--color-border)",
          paddingBottom: "2rem",
          marginBottom: "2rem",
          animation: "slideDown 0.4s ease forwards"
        }}>
          <h1 className={styles.title} style={{ fontSize: "2.4rem" }}>¡Juego Terminado!</h1>
          
          <div 
            className={styles.scoreCircle} 
            onClick={handleManualConfetti} 
            title="¡Haz clic para lanzar más confeti!"
            style={{ cursor: "pointer", width: "110px", height: "110px", margin: "1rem 0" }}
          >
            <span className={styles.scoreNumber} style={{ fontSize: "2.2rem" }}>{currentUserScore.score}</span>
            <span className={styles.scoreTotal} style={{ fontSize: "0.8rem" }}>de 15</span>
          </div>

          <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
            Nombre: <strong>{currentUserScore.player_name}</strong> • Tiempo: <strong>{formatTime(currentUserScore.time_taken_seconds)}</strong>
          </div>

          <div className={styles.badgeTitle} style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>
            <Award size={18} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.4rem", color: "var(--color-primary-gold)" }} />
            {getBadgeDetails(currentUserScore.score).title}
          </div>
          
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", margin: "0 auto 1.5rem", maxWidth: "42ch", lineHeight: "1.5" }}>
            {getBadgeDetails(currentUserScore.score).desc}
          </p>

          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <button
              onClick={handleShareWhatsApp}
              className={styles.btnPrimary}
              style={{ padding: "0.7rem 1.2rem", fontSize: "0.85rem" }}
              type="button"
            >
              <Share2 size={16} /> Compartir en WhatsApp
            </button>

            <button
              type="button"
              onClick={() => setShowReview(!showReview)}
              className={styles.btnSecondary}
              style={{ padding: "0.7rem 1.2rem", fontSize: "0.85rem" }}
            >
              {showReview ? "Ocultar respuestas 🔼" : "Revisar tus respuestas 🔽"}
            </button>
          </div>

          {/* Correct/Incorrect Answer Review accordion */}
          {showReview && selectedAnswers && (
            <div className={styles.fadeIn} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left", marginTop: "1rem" }}>
              {quizQuestions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;
                
                return (
                  <div key={q.id} style={{
                    padding: "1.1rem",
                    borderRadius: "var(--radius-md)",
                    border: isCorrect ? "1px solid rgba(76, 175, 80, 0.25)" : "1px solid rgba(244, 67, 54, 0.25)",
                    background: isCorrect ? "rgba(76, 175, 80, 0.02)" : "rgba(244, 67, 54, 0.02)"
                  }}>
                    <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--color-text-charcoal)" }}>
                      {q.id}. {q.question}
                    </h4>
                    
                    <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.2rem", marginBottom: "0.5rem" }}>
                      <div style={{ color: isCorrect ? "var(--color-correct-text)" : "var(--color-incorrect-text)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span>Tu respuesta:</span>
                        <strong>{q.options[userAns] !== undefined ? q.options[userAns] : "Sin respuesta"}</strong>
                        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>{isCorrect ? "✓" : "✗"}</span>
                      </div>
                      
                      {!isCorrect && (
                        <div style={{ color: "var(--color-correct-text)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span>Respuesta correcta:</span>
                          <strong>{q.options[q.correctAnswer]}</strong>
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted)",
                      padding: "0.5rem 0.7rem",
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
      )}

      {/* ─── CLASIFICACIÓN GLOBAL TITLE ─── */}
      <div className={styles.header}>
        <h1 className={styles.title} style={{ fontSize: currentUserScore ? "1.8rem" : "2.6rem" }}>
          {currentUserScore ? "Clasificación Global 🏆" : "Clasificación 🏆"}
        </h1>
        <p className={styles.subtitle}>Los que más conocen a Adrián y Nadia</p>
      </div>

      <div className={styles.leaderboardContainer}>
        {/* Filters & Refresh */}
        <div style={{ display: "flex", justifyContent: uniqueGroups.length > 0 ? "space-between" : "flex-end", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
          {uniqueGroups.length > 0 && (
            <div className={styles.formGroup} style={{ flexGrow: 1, margin: 0 }}>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className={styles.select}
                style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
              >
                <option value="all">Filtrar por Grupo (Todos)</option>
                {uniqueGroups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={styles.btnSecondary}
            style={{ padding: "0.6rem 1rem", fontSize: "0.85rem", flexShrink: 0, marginLeft: uniqueGroups.length > 0 ? "0" : "auto" }}
            title="Actualizar ranking"
            type="button"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} style={{ animation: isLoading ? "spin 1s linear infinite" : "none" }} /> Actualizar
          </button>
        </div>

        {/* Score Card List */}
        <div className={styles.leaderboardList}>
          {filteredScores.length === 0 ? (
            <div className={styles.noScores}>
              {isLoading ? "Cargando clasificación..." : "Aún no hay puntuaciones en este grupo."}
            </div>
          ) : (
            filteredScores.map((entry, idx) => {
              // Determine if this is the current user's entry
              const isCurrent = currentUserScore &&
                entry.player_name === currentUserScore.player_name &&
                entry.group_name === currentUserScore.group_name &&
                entry.score === currentUserScore.score &&
                entry.time_taken_seconds === currentUserScore.time_taken_seconds;

              // Generate initials and HSL color for the avatar
              const initials = getInitials(entry.player_name);
              const avatarColor = getAvatarColor(entry.player_name);
              
              // Get podium rank decoration
              const renderRankIcon = (rankIndex: number) => {
                if (rankIndex === 0) return <span style={{ fontSize: "1.35rem" }} title="1er Puesto">👑</span>;
                if (rankIndex === 1) return <span style={{ fontSize: "1.35rem" }} title="2do Puesto">🥈</span>;
                if (rankIndex === 2) return <span style={{ fontSize: "1.35rem" }} title="3er Puesto">🥉</span>;
                return <span className={styles.rankNumber}>{rankIndex + 1}</span>;
              };

              const groupBadgeStyle = getGroupBadgeStyle(entry.group_name);
              
              // Only add relationship accent bar if it's not the current user (which has its own full pulsing gold border)
              const cardInlineStyle = isCurrent 
                ? {} 
                : { borderLeft: `4px solid ${groupBadgeStyle.color}` };

              return (
                <div
                  key={idx}
                  className={`${styles.playerRowCard} ${isCurrent ? styles.currentUser : ""}`}
                  style={cardInlineStyle}
                >
                  {/* Left: Rank & Avatar */}
                  <div className={styles.rankSection}>
                    <div style={{ width: "30px", display: "flex", justifyContent: "center" }}>
                      {renderRankIcon(idx)}
                    </div>
                    <div
                      className={styles.avatarCircle}
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initials}
                    </div>
                  </div>

                  {/* Center: Player Name & Group Pill */}
                  <div className={styles.playerInfo}>
                    <h3 className={styles.playerNameText}>
                      {entry.player_name} {isCurrent && <span style={{ fontStyle: "italic", fontSize: "0.8rem", color: "var(--color-primary-gold)" }}>(Tú)</span>}
                    </h3>
                    {entry.group_name && entry.group_name.toLowerCase().trim() !== "invitado" && (
                      <span 
                        className={styles.groupPill}
                        style={groupBadgeStyle}
                      >
                        {entry.group_name}
                      </span>
                    )}
                  </div>

                  {/* Right: Score & Time */}
                  <div className={styles.scoreSection}>
                    <div className={styles.scorePill}>
                      {entry.score}/{entry.total_questions || 15}
                    </div>
                    <span className={styles.timeLabel}>
                      ⏱️ {formatTime(entry.time_taken_seconds)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Back Actions */}
        <div className={styles.resultsActions} style={{ marginTop: "1.5rem" }}>
          <button
            onClick={onBack}
            className={styles.btnSecondary}
            type="button"
            style={{ width: "100%" }}
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </button>

          <button
            onClick={handleClearLocalScores}
            className={styles.btnSecondary}
            type="button"
            style={{ width: "100%", borderColor: "rgba(244, 67, 54, 0.4)", color: "#f44336" }}
          >
            Borrar Resultados
          </button>
        </div>
      </div>
      
      {/* Dynamic Keyframe style for refresh spin */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
