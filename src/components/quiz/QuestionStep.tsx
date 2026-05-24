"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Quiz.module.css";
import { QuizQuestion } from "@/lib/quiz-questions";
import { Volume2, VolumeX, ArrowRight, Check, X } from "lucide-react";
import confetti from "canvas-confetti";

interface QuestionStepProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIdx: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function QuestionStep({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isMuted,
  onToggleMute
}: QuestionStepProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Reset state when question changes
  useEffect(() => {
    setSelectedIdx(null);
    setIsAnswered(false);
    
    // Clear any falling confetti particles instantly when transitioning to the next question
    try {
      confetti.reset();
    } catch (e) {
      console.warn("Failed to reset confetti:", e);
    }
  }, [question]);

  // Synthesize audio notes using Web Audio API
  const playSound = (type: "correct" | "incorrect") => {
    if (isMuted) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (type === "correct") {
        // High, cheerful bell chime
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.22); // C6

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now + 0.08);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
      } else {
        // Soft cartoon buzz
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25); // Slurs down

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser:", e);
    }
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctAnswer;
    
    if (isCorrect) {
      playSound("correct");
      // Trigger confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 }
      });
    } else {
      playSound("incorrect");
    }
  };

  const handleNext = () => {
    if (selectedIdx === null) return;
    onAnswer(selectedIdx);
  };

  const progressPercent = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className={styles.fadeIn}>
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressInfo}>
          <span>Pregunta {questionNumber} de {totalQuestions}</span>
          <span>{Math.round(((questionNumber - 1) / totalQuestions) * 100)}% Completado</span>
        </div>
        <div className={styles.progressBarOuter}>
          <div 
            className={styles.progressBarInner} 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <h2 className={styles.questionText}>
        {question.question}
      </h2>

      {/* Choices Grid */}
      <div className={styles.choicesGrid}>
        {question.options.map((option, idx) => {
          let btnClass = styles.choiceBtn;
          let checkIcon = null;

          if (isAnswered) {
            btnClass += ` ${styles.answered}`;
            if (idx === question.correctAnswer) {
              btnClass += ` ${styles.correct}`;
              checkIcon = <Check size={16} style={{ marginLeft: "auto", strokeWidth: 3 }} />;
            } else if (idx === selectedIdx) {
              btnClass += ` ${styles.incorrect}`;
              checkIcon = <X size={16} style={{ marginLeft: "auto", strokeWidth: 3 }} />;
            } else {
              btnClass += ` ${styles.unselected}`;
            }
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              type="button"
            >
              <span className={styles.choiceNumber}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{option}</span>
              {checkIcon}
            </button>
          );
        })}
      </div>

      {/* Fun Fact Area (Revealed after answering) */}
      {isAnswered && (
        <div className={styles.funFactBox}>
          <div className={styles.funFactTitle}>💡 ¿Sabías que...?</div>
          <p className={styles.funFactText}>{question.funFact}</p>
        </div>
      )}

      {/* Footer controls */}
      {isAnswered && (
        <div className={styles.footerActions}>
          <button
            onClick={handleNext}
            className={styles.btnPrimary}
            type="button"
          >
            Siguiente <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
