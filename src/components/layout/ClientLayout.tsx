"use client";

import { useState, useEffect } from "react";
import EnvelopeIntro from "@/components/features/EnvelopeIntro/EnvelopeIntro";
import MusicPlayer from "@/components/features/MusicPlayer/MusicPlayer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Allow envelope to signal when to start music and show site
    const handleEnvelopeOpen = () => {
        setHasOpenedEnvelope(true);
        // Slight delay to allow animation to clear before setting full interactivity if needed
        setTimeout(() => {
            setShowContent(true);
        }, 500);
    };

    return (
        <>
            <EnvelopeIntro onOpen={handleEnvelopeOpen} />

            {/* Music Player starts when envelope opens */}
            <MusicPlayer autoPlay={hasOpenedEnvelope} />

            {/* Main Content */}
            <main style={{
                opacity: showContent ? 1 : 0,
                transition: "opacity 1s ease-in-out",
                filter: showContent ? "none" : "blur(10px)"
            }}>
                {children}
            </main>
        </>
    );
}
