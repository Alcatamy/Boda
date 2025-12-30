"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function SpotlightCursor() {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isVisible, setIsVisible] = useState(false);

    // Smooth spring animation for the cursor follower
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            springX.set(e.clientX - 250); // Center the 500px spotlight
            springY.set(e.clientY - 250);
            setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", updateMousePosition);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [springX, springY]);

    if (!isVisible) return null;

    return (
        <motion.div
            style={{
                position: "fixed",
                left: springX,
                top: springY,
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(180, 151, 90, 0.15) 0%, rgba(180, 151, 90, 0) 70%)",
                pointerEvents: "none",
                zIndex: 9998, /* Just below the envelope overlay and high UI elements */
                mixBlendMode: "multiply" // Subtle blending
            }}
        />
    );
}
