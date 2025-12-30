"use client";

import { useEffect, useRef } from "react";

export default function ButterflyEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // State
        const mouse = { x: width / 2, y: height / 2 };
        const butterfly = { x: width / 2, y: height / 2, angle: 0, wing: 0 };
        const sparkles: { x: number; y: number; age: number; size: number }[] = [];

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if ("touches" in e) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            } else {
                mouse.x = (e as MouseEvent).clientX;
                mouse.y = (e as MouseEvent).clientY;
            }
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchstart", handleMove);
        window.addEventListener("touchmove", handleMove);

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener("resize", resize);

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Move Butterfly heavily towards mouse (Ease out)
            const dx = mouse.x - butterfly.x;
            const dy = mouse.y - butterfly.y;
            butterfly.x += dx * 0.05;
            butterfly.y += dy * 0.05;

            // Angle based on movement
            const targetAngle = Math.atan2(dy, dx);
            // Smooth rotation logic could go here, simplified:
            butterfly.angle = targetAngle;

            // Wing flap
            butterfly.wing += 0.2;

            // 2. Draw Butterfly (Simplified geometry or could be an image)
            ctx.save();
            ctx.translate(butterfly.x, butterfly.y);
            ctx.rotate(butterfly.angle + Math.PI / 2); // Orient head

            // Draw Wings
            ctx.fillStyle = "rgba(197, 160, 89, 0.8)"; // Gold
            const flap = Math.sin(butterfly.wing) * 0.5 + 0.5; // 0 to 1

            // Left Wing
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-15 * flap, -20, -20 * flap, 0);
            ctx.quadraticCurveTo(-15 * flap, 20, 0, 10);
            ctx.fill();

            // Right Wing
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(15 * flap, -20, 20 * flap, 0);
            ctx.quadraticCurveTo(15 * flap, 20, 0, 10);
            ctx.fill();

            ctx.restore();

            // 3. Add Sparkles
            if (Math.random() < 0.3) { // 30% chance per frame
                sparkles.push({ x: butterfly.x, y: butterfly.y, age: 0, size: Math.random() * 3 });
            }

            // 4. Draw & Update Sparkles
            for (let i = sparkles.length - 1; i >= 0; i--) {
                const s = sparkles[i];
                s.age++;
                s.y += 0.5; // Fall down slightly

                ctx.fillStyle = `rgba(255, 215, 0, ${1 - s.age / 50})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();

                if (s.age > 50) sparkles.splice(i, 1);
            }

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchstart", handleMove);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
}
