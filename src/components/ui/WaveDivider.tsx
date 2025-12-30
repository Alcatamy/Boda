"use client";

import styles from "./WaveDivider.module.css";

type WaveDividerProps = {
    flip?: boolean;
    color?: string;
};

export default function WaveDivider({ flip = false, color }: WaveDividerProps) {
    return (
        <div
            className={`${styles.divider} ${flip ? styles.flip : ""}`}
            style={color ? { "--wave-color": color } as React.CSSProperties : undefined}
        >
            <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <path
                    d="M0 60C240 0 480 120 720 60C960 0 1200 120 1440 60V120H0V60Z"
                    fill="var(--wave-color, rgba(0,0,0,0.03))"
                />
            </svg>
        </div>
    );
}
