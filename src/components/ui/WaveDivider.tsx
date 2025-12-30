"use client";

import styles from "./WaveDivider.module.css";

export default function WaveDivider({ flip = false }: { flip?: boolean }) {
    return (
        <div className={`${styles.divider} ${flip ? styles.flip : ""}`}>
            {/* Wheat/Espiga Icon Separator */}
            <div className={styles.wheatContainer}>
                <svg
                    className={styles.wheat}
                    viewBox="0 0 100 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Left wheat stalk */}
                    <g className={styles.wheatLeft}>
                        <ellipse cx="20" cy="15" rx="4" ry="8" fill="#D4AF37" opacity="0.9" />
                        <ellipse cx="15" cy="22" rx="3" ry="6" fill="#D4AF37" opacity="0.8" />
                        <ellipse cx="25" cy="22" rx="3" ry="6" fill="#D4AF37" opacity="0.8" />
                        <ellipse cx="18" cy="28" rx="2.5" ry="5" fill="#D4AF37" opacity="0.7" />
                        <ellipse cx="22" cy="28" rx="2.5" ry="5" fill="#D4AF37" opacity="0.7" />
                        <line x1="20" y1="15" x2="20" y2="55" stroke="#B4975A" strokeWidth="1.5" />
                    </g>

                    {/* Center wheat stalk (larger) */}
                    <g className={styles.wheatCenter}>
                        <ellipse cx="50" cy="10" rx="5" ry="10" fill="#D4AF37" />
                        <ellipse cx="43" cy="18" rx="4" ry="8" fill="#D4AF37" opacity="0.9" />
                        <ellipse cx="57" cy="18" rx="4" ry="8" fill="#D4AF37" opacity="0.9" />
                        <ellipse cx="46" cy="26" rx="3" ry="6" fill="#D4AF37" opacity="0.8" />
                        <ellipse cx="54" cy="26" rx="3" ry="6" fill="#D4AF37" opacity="0.8" />
                        <ellipse cx="48" cy="33" rx="2.5" ry="5" fill="#D4AF37" opacity="0.7" />
                        <ellipse cx="52" cy="33" rx="2.5" ry="5" fill="#D4AF37" opacity="0.7" />
                        <line x1="50" y1="10" x2="50" y2="55" stroke="#B4975A" strokeWidth="2" />
                    </g>

                    {/* Right wheat stalk */}
                    <g className={styles.wheatRight}>
                        <ellipse cx="80" cy="15" rx="4" ry="8" fill="#D4AF37" opacity="0.9" />
                        <ellipse cx="75" cy="22" rx="3" ry="6" fill="#D4AF37" opacity="0.8" />
                        <ellipse cx="85" cy="22" rx="3" ry="6" fill="#D4AF37" opacity="0.8" />
                        <ellipse cx="78" cy="28" rx="2.5" ry="5" fill="#D4AF37" opacity="0.7" />
                        <ellipse cx="82" cy="28" rx="2.5" ry="5" fill="#D4AF37" opacity="0.7" />
                        <line x1="80" y1="15" x2="80" y2="55" stroke="#B4975A" strokeWidth="1.5" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
