"use client";

import React, { useState, useEffect } from "react";
import styles from "./Quiz.module.css";
import WelcomeStep from "./WelcomeStep";
import QuestionStep from "./QuestionStep";
import LeaderboardStep, { ScoreEntry } from "./LeaderboardStep";
import { quizQuestions } from "@/lib/quiz-questions";
import { RefreshCw } from "lucide-react";

type GameState = "welcome" | "playing" | "results" | "leaderboard";

// Helper to get 15 warm, vibrant summer colors (soft but clearly colored backgrounds) for each question
const getPastelColor = (idx: number) => {
  const hues = [
    48,  // 1. Sunny Yellow
    345, // 2. Coral Pink
    180, // 3. Turquoise Blue
    20,  // 4. Bright Peach
    200, // 5. Sky Blue
    85,  // 6. Lime Green
    280, // 7. Sunset Violet
    33,  // 8. Soft Apricot
    130, // 9. Tropical Green
    42,  // 10. Warm Gold
    260, // 11. Summer Lavender
    15,  // 12. Tangerine
    155, // 13. Mint Green
    330, // 14. Raspberry Pink
    190  // 15. Ocean Aqua
  ];
  
  const hue = hues[idx % hues.length];
  
  // Vibrant summer light mode (80-84% lightness for high color visibility, 85% saturation)
  const lightness = hue === 48 || hue === 42 || hue === 85 ? 85 : 82; // Yellows/limes slightly lighter for contrast comfort
  return `hsla(${hue}, 85%, ${lightness}%, 0.96)`;
};

export default function QuizGame() {
  const [gameState, setGameState] = useState<GameState>("welcome");
  
  // Player state
  const [playerName, setPlayerName] = useState("");
  const [groupName, setGroupName] = useState("");
  
  // Game progress state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  
  // Audio state
  const [isMuted, setIsMuted] = useState(false);

  // Leaderboard data state
  const [leaderboardScores, setLeaderboardScores] = useState<ScoreEntry[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  // Load sound setting on mount
  useEffect(() => {
    const savedMute = localStorage.getItem("quiz_muted");
    if (savedMute) {
      setIsMuted(savedMute === "true");
    }
    fetchLeaderboard();
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem("quiz_muted", String(nextMuted));
  };

  // Fetch ranking from API
  const fetchLeaderboard = async () => {
    setIsLoadingScores(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/quiz/scores");
      if (!res.ok) throw new Error("No se pudo obtener el ranking");
      const data = await res.json();
      if (data.success) {
        let scoresList = data.scores || [];
        
        // Merge with local storage entries for this browser (so they see their offline runs!)
        const localScoresRaw = localStorage.getItem("local_quiz_scores");
        if (localScoresRaw) {
          const localScores: ScoreEntry[] = JSON.parse(localScoresRaw);
          // Check if they are already in the database response to avoid duplication
          localScores.forEach((local) => {
            const exists = scoresList.some(
              (s: any) =>
                s.player_name === local.player_name &&
                s.score === local.score &&
                s.time_taken_seconds === local.time_taken_seconds
            );
            if (!exists) {
              scoresList.push(local);
            }
          });
          // Re-sort scoresList
          scoresList.sort((a: ScoreEntry, b: ScoreEntry) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time_taken_seconds - b.time_taken_seconds;
          });
        }
        
        setLeaderboardScores(scoresList);
      } else {
        throw new Error(data.error || "Fallo en la carga");
      }
    } catch (err: any) {
      console.warn("Fallo al obtener la clasificación en tiempo real:", err);
      // fallback
      const localScoresRaw = localStorage.getItem("local_quiz_scores");
      if (localScoresRaw) {
        setLeaderboardScores(JSON.parse(localScoresRaw));
      }
    } finally {
      setIsLoadingScores(false);
    }
  };

  const handleStartGame = (name: string, group: string) => {
    setPlayerName(name);
    setGroupName(group);
    setScore(0);
    setSelectedAnswers([]);
    setCurrentQuestionIdx(0);
    setStartTime(Date.now());
    setScoreSaved(false);
    setGameState("playing");
  };

  const handleAnswerQuestion = (selectedIdx: number) => {
    const isCorrect = selectedIdx === quizQuestions[currentQuestionIdx].correctAnswer;
    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(nextScore);
    }
    const nextAnswers = [...selectedAnswers, selectedIdx];
    setSelectedAnswers(nextAnswers);

    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < quizQuestions.length) {
      setCurrentQuestionIdx(nextIdx);
    } else {
      // Game ended
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setTimeTaken(elapsed);
      // Save score directly and redirect to leaderboard
      handleSaveScoreDirectly(nextScore, elapsed, nextAnswers);
    }
  };

  // Submit score to database or save locally as fallback
  const handleSaveScoreDirectly = async (finalScore: number, finalTime: number, finalAnswers: number[]) => {
    setIsSavingScore(true);
    setErrorMsg(null);
    
    const payload = {
      player_name: playerName,
      group_name: groupName,
      score: finalScore,
      total_questions: quizQuestions.length,
      time_taken_seconds: finalTime
    };

    try {
      const res = await fetch("/api/quiz/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      // Save locally to local_quiz_scores anyway so the user sees their run instantly
      const localScoresRaw = localStorage.getItem("local_quiz_scores");
      const localScores: ScoreEntry[] = localScoresRaw ? JSON.parse(localScoresRaw) : [];
      localScores.push(payload);
      localStorage.setItem("local_quiz_scores", JSON.stringify(localScores));
      
      setScoreSaved(true);
      
      // Refresh the ranking
      await fetchLeaderboard();
      setGameState("leaderboard");
    } catch (err: any) {
      console.warn("Fallo al guardar puntuación en remoto:", err);
      
      // Save locally as final fallback
      const localScoresRaw = localStorage.getItem("local_quiz_scores");
      const localScores: ScoreEntry[] = localScoresRaw ? JSON.parse(localScoresRaw) : [];
      localScores.push(payload);
      localStorage.setItem("local_quiz_scores", JSON.stringify(localScores));
      
      setScoreSaved(true);
      
      // Mock refresh
      setLeaderboardScores((prev) => {
        const merged = [...prev, payload];
        return merged.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.time_taken_seconds - b.time_taken_seconds;
        });
      });
      setGameState("leaderboard");
    } finally {
      setIsSavingScore(false);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setSelectedAnswers([]);
    setCurrentQuestionIdx(0);
    setScoreSaved(false);
    setGameState("welcome");
  };

  const handleViewLeaderboard = () => {
    fetchLeaderboard();
    setGameState("leaderboard");
  };

  // Determine dynamic card background color for each question
  const cardStyle = gameState === "playing"
    ? { backgroundColor: getPastelColor(currentQuestionIdx) }
    : {};

  return (
    <div className={styles.container}>
      <div className={styles.card} style={cardStyle}>
        
        {errorMsg && (
          <div className={styles.errorState}>
            ⚠️ {errorMsg}
          </div>
        )}

        {isSavingScore ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className={styles.scoreCircle} style={{ borderStyle: "solid", animation: "spin 2s linear infinite", width: "100px", height: "100px", margin: "1.5rem 0" }}>
              <RefreshCw size={36} style={{ color: "var(--color-primary-gold)" }} />
            </div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--color-primary-gold)", marginTop: "1rem", marginBottom: "0.5rem" }}>
              Guardando tu puntuación...
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: "0 auto", maxWidth: "35ch", lineHeight: 1.4 }}>
              Calculando tu rango y cargando la clasificación en tiempo real.
            </p>
          </div>
        ) : (
          <>
            {gameState === "welcome" && (
              <WelcomeStep
                onStart={handleStartGame}
                isLoadingLeaderboard={isLoadingScores}
                onViewLeaderboard={handleViewLeaderboard}
              />
            )}

            {gameState === "playing" && (
              <QuestionStep
                question={quizQuestions[currentQuestionIdx]}
                questionNumber={currentQuestionIdx + 1}
                totalQuestions={quizQuestions.length}
                onAnswer={handleAnswerQuestion}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
              />
            )}

            {gameState === "leaderboard" && (
              <LeaderboardStep
                scores={leaderboardScores}
                currentUserScore={
                  scoreSaved
                    ? { player_name: playerName, group_name: groupName, score, time_taken_seconds: timeTaken }
                    : undefined
                }
                selectedAnswers={selectedAnswers}
                onBack={handleRestart}
                onRefresh={fetchLeaderboard}
                isLoading={isLoadingScores}
              />
            )}
          </>
        )}
      </div>
      
      {/* Global CSS animation for loading spin */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
