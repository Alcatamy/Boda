"use client";

import { motion } from "framer-motion";

export default function SectionIcon({ src }: { src: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
        zIndex: 10,
        marginTop: "2rem",
        marginBottom: "-3rem",
      }}
    >
      <motion.img
        src={src}
        alt="Decoración elegante"
        style={{ width: "90px", height: "auto", objectFit: "contain" }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
