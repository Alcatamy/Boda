"use client";

import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollBackground() {
    const { scrollY, scrollYProgress } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

    // Transform scroll progress to a sequence of light, elegant colors
    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        [
            "#fafaf9", // Base White (Start)
            "#fdfbf7", // Warm Ivory
            "#fefce8", // Very Pale Gold/Yellow
            "#f0f9ff", // Very Pale Blue (Sky)
            "#fff1f2", // Very Pale Rose
            "#fafaf9"  // Back to Base White (End)
        ]
    );

    // Velocity Effect: "Flipbook" / Speed Lines opacity
    // Maps velocity (absolute value) to opacity. 
    // Normal scroll = 0 opacity. Fast scroll = up to 0.3 opacity.
    const rawVelocity = useMotionValue(0);
    const [showEffect, setShowEffect] = useState(false);

    useMotionValueEvent(smoothVelocity, "change", (latest) => {
        const speed = Math.abs(latest);
        rawVelocity.set(speed);
        setShowEffect(speed > 800); // Threshold for "fast" scroll
    });

    const effectOpacity = useTransform(rawVelocity, [0, 800, 2000], [0, 0, 0.5]);

    return (
        <>
            {/* 1. Dynamic Background Gradient */}
            <motion.div
                style={{
                    backgroundColor,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -2, // Behind everything
                    transition: "background-color 0.5s ease"
                }}
            />

            {/* 2. Fast Scroll "Flipbook / Speed" Effect */}
            {/* Visual distortion/grain overlay that appears on fast scroll */}
            <motion.div
                style={{
                    opacity: effectOpacity,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 40, // On top of content but below modals
                    pointerEvents: "none",
                    background: "url('/images/noise-light.png')", // Or a generated CSS pattern
                    backdropFilter: "blur(2px)", // Slight motion blur simulation
                    mixBlendMode: "overlay"
                }}
            >
                {/* Optional: Add vertical speed lines using CSS gradients */}
                <div style={{
                    width: "100%",
                    height: "100%",
                    background: "repeating-linear-gradient(90deg, transparent 0, transparent 40px, rgba(197, 160, 89, 0.1) 40px, rgba(197, 160, 89, 0.1) 41px)"
                }} />
            </motion.div>
        </>
    );
}
