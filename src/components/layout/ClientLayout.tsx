"use client";

import { useState } from "react";
import { motion, useScroll, useVelocity, useTransform, useSpring } from "framer-motion";
import EnvelopeIntro from "@/components/features/EnvelopeIntro/EnvelopeIntro";
import MusicPlayer from "@/components/features/MusicPlayer/MusicPlayer";
import SpotlightCursor from "@/components/ui/SpotlightCursor";
import ButterflyEffect from "@/components/ui/ButterflyEffect";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isQuiz = pathname?.startsWith('/quiz');
    const isHoneymoon = pathname?.startsWith('/luna-de-miel');

    const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Scroll Velocity Hooks for Dynamic Background
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityOpacity = useTransform(smoothVelocity, [-2000, 0, 2000], [0.5, 0, 0.5]);
    const backgroundColor = useTransform(
        smoothVelocity,
        [-2000, 0, 2000],
        ["rgba(212, 175, 55, 0.4)", "rgba(255, 255, 255, 0)", "rgba(59, 130, 246, 0.4)"]
    );

    // Play music as soon as envelope opens
    const handleEnvelopeOpen = () => {
        setHasOpenedEnvelope(true);
    };

    // Show content only after video finishes fading to white
    const handleEnvelopeComplete = () => {
        setShowContent(true);
    };

    if (isAdmin || isQuiz || isHoneymoon) {
        return <>{children}</>;
    }

    return (
        <>
            <EnvelopeIntro onOpen={handleEnvelopeOpen} onComplete={handleEnvelopeComplete} />

            {/* Music Player starts when intro video finishes and content shows */}
            <MusicPlayer autoPlay={showContent} />

            {/* Global Effects */}
            {showContent && (
                <>
                    <SpotlightCursor />
                    <ButterflyEffect />
                </>
            )}

            {/* Dynamic Scroll Background */}
            <motion.div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                    zIndex: -1,
                    backgroundColor: backgroundColor,
                    opacity: velocityOpacity,
                }}
            />

            {/* Main Content */}
            <main style={{
                opacity: showContent ? 1 : 0,
                transition: "opacity 1s ease-in-out",
                filter: showContent ? "none" : "blur(10px)",
                minHeight: "100vh",
                position: "relative"
            }}>
                {children}
            </main>
        </>
    );
}
