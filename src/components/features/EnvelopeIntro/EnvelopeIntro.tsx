"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./EnvelopeIntro.module.css";

interface EnvelopeIntroProps {
  onOpen?: () => void;
  onComplete?: () => void;
}

export default function EnvelopeIntro({ onOpen, onComplete }: EnvelopeIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-hide prompt after a few seconds if they don't click
  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    if (!isOpen && videoRef.current) {
      setIsOpen(true);
      setShowPrompt(false);
      if (onOpen) onOpen();
      videoRef.current.play().catch(err => {
        console.error("Video play failed", err);
        setIsVideoFinished(true);
        if (onComplete) onComplete();
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isVideoFinished) {
      const timeRemaining = videoRef.current.duration - videoRef.current.currentTime;
      // Start fade out 1 second before it perfectly ends for a smoother transition
      if (timeRemaining < 1.0) {
        setIsVideoFinished(true);
        if (onComplete) onComplete();
      }
    }
  };

  const handleVideoEnded = () => {
    if (!isVideoFinished) {
      setIsVideoFinished(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isVideoFinished && (
          <motion.div 
            className={styles.introOverlay}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            onClick={handleOpen}
          >
            <video
              ref={videoRef}
              className={`${styles.video} ${isOpen ? styles.zooming : ""}`}
              src="/videos/envelope.mp4"
              playsInline
              preload="auto"
              muted // Muted helps with mobile constraints even on click
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
            />

            <AnimatePresence>
              {!isOpen && showPrompt && (
                <motion.div 
                  className={styles.prompt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <span className={styles.promptText}>Tocar para abrir</span>
                  <motion.div 
                    className={styles.pulseDot}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
