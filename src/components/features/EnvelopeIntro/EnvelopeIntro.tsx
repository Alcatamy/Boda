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
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Safety net: if the user does not click within 7 seconds of mounting,
  // automatically complete the intro so they are not stuck.
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isOpen && !isVideoFinished) {
        console.warn("Envelope intro loading timed out, skipping to content.");
        setIsVideoFinished(true);
        if (onComplete) onComplete();
      }
    }, 7000);

    return () => clearTimeout(fallbackTimer);
  }, [isOpen, isVideoFinished, onComplete]);

  const handleOpen = () => {
    if (!isOpen && videoRef.current) {
      setIsOpen(true);
      if (onOpen) onOpen();
      videoRef.current.play().catch(err => {
        console.error("Video play failed", err);
        setIsVideoFinished(true);
        if (onComplete) onComplete();
      });

      // Safety transition: if the video gets stuck playing, force transition after 5 seconds
      setTimeout(() => {
        if (!isVideoFinished) {
          setIsVideoFinished(true);
          if (onComplete) onComplete();
        }
      }, 5000);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isVideoFinished) {
      const duration = videoRef.current.duration;
      if (duration && !isNaN(duration)) {
        const timeRemaining = duration - videoRef.current.currentTime;
        // Start fade out 1 second before it perfectly ends for a smoother transition
        if (timeRemaining < 1.0) {
          setIsVideoFinished(true);
          if (onComplete) onComplete();
        }
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
              onCanPlay={() => setIsReady(true)}
              onPlay={() => setIsReady(true)}
              style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
            />

            <AnimatePresence>
              {!isOpen && (
                <motion.div 
                  className={styles.prompt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
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
