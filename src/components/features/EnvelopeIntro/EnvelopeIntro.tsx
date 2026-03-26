"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./EnvelopeIntro.module.css";

export default function EnvelopeIntro({ children }: { children: React.ReactNode }) {
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
      videoRef.current.play().catch(err => {
        console.error("Video play failed", err);
        // Fallback if video fails to play
        setIsVideoFinished(true);
      });
    }
  };

  const handleVideoEnded = () => {
    // Wait a tiny bit on the white frame, then fade out the intro layer
    setTimeout(() => {
      setIsVideoFinished(true);
    }, 500);
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

      {/* Render main site content below */}
      <div className={styles.mainContent} style={{ opacity: isVideoFinished ? 1 : 0, transition: "opacity 1s ease-in-out", visibility: isVideoFinished ? "visible" : "hidden", height: isVideoFinished ? "auto" : "100vh", overflow: isVideoFinished ? "auto" : "hidden" }}>
        {children}
      </div>
    </>
  );
}
