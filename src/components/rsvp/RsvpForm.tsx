"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { CheckCircle, AlertCircle, Utensils, CloudRain, Loader2 } from "lucide-react";
import styles from "./RsvpForm.module.css";

type FormData = {
  firstName: string;
  lastName: string;
  attending: string; // "yes" | "no"
  dietaryRestrictions: string;
  menuChoice: string; // "meat" | "fish"
};

export default function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [rainEffect, setRainEffect] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const attending = watch("attending");
  const menuChoice = watch("menuChoice");

  // Effect: Confetti for YES, Rain for NO
  useEffect(() => {
    if (submitStatus === "success") {
      if (attending === "yes") {
        import("canvas-confetti").then((confetti) => {
          // Party canon!
          const duration = 3000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

          const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

          const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti.default({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#c5a059', '#D4AF37', '#ffffff'] });
            confetti.default({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#c5a059', '#D4AF37', '#ffffff'] });
          }, 250);
        });
      } else {
        // Rain effect
        setRainEffect(true);
        setTimeout(() => setRainEffect(false), 5000); // 5 seconds of sadness
      }
    }
  }, [submitStatus, attending]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const { error } = await supabase
        .from('guests')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            attending: data.attending === "yes",
            dietary_restrictions: data.dietaryRestrictions,
            menu_choice: data.menuChoice,
            // message removed per request
          },
        ]);

      if (error) throw error;
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className={styles.successWrapper}>
        {/* Rain Overlay */}
        {rainEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.rainOverlay}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={styles.drop} style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random()}s`
              }} />
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.successMessage}
        >
          {attending === "yes" ? (
            <>
              <CheckCircle size={64} className={styles.successIcon} color="#D4AF37" />
              <h3>¡Qué alegría!</h3>
              <p>Contamos contigo para el gran día. ¡Nos vemos en la fiesta!</p>
            </>
          ) : (
            <>
              <CloudRain size={64} className={styles.successIcon} color="#64748b" />
              <h3>¡Oh, qué pena!</h3>
              <p>Te echaremos mucho de menos, pero entendemos que no puedas venir.</p>
            </>
          )}

          <button
            onClick={() => setSubmitStatus("idle")}
            className={styles.resetButton}
          >
            Enviar otra respuesta
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* Name Fields */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label htmlFor="firstName">Nombre *</label>
          <input
            {...register("firstName", { required: true })}
            placeholder="Tu nombre"
            className={styles.input}
          />
          {errors.firstName && <span className={styles.error}>Requerido</span>}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="lastName">Apellidos *</label>
          <input
            {...register("lastName", { required: true })}
            placeholder="Tus apellidos"
            className={styles.input}
          />
          {errors.lastName && <span className={styles.error}>Requerido</span>}
        </div>
      </div>

      {/* Attendance Radio */}
      <div className={styles.fieldGroup}>
        <label>¿Podrás acompañarnos? *</label>
        <div className={styles.radioGroup}>
          <label className={`${styles.radioOption} ${attending === "yes" ? styles.selected : ""}`}>
            <input
              type="radio"
              value="yes"
              {...register("attending", { required: true })}
            />
            <span>¡Sí, allí estaré!</span>
          </label>
          <label className={`${styles.radioOption} ${attending === "no" ? styles.selected : ""}`}>
            <input
              type="radio"
              value="no"
              {...register("attending", { required: true })}
            />
            <span>Lo siento, no podré ir</span>
          </label>
        </div>
        {errors.attending && <span className={styles.error}>Por favor selecciona una opción</span>}
      </div>

      <AnimatePresence>
        {attending === "yes" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.conditionalFields}
          >
            {/* Menu Choice */}
            <div className={styles.fieldGroup}>
              <label><Utensils size={16} /> Preferencia de Menú</label>
              <div className={styles.radioGroup}>
                <label className={`${styles.radioOption} ${menuChoice === "meat" ? styles.selected : ""}`}>
                  <input
                    type="radio"
                    value="meat"
                    {...register("menuChoice")}
                  />
                  <span>🥩 Carne</span>
                </label>
                <label className={`${styles.radioOption} ${menuChoice === "fish" ? styles.selected : ""}`}>
                  <input
                    type="radio"
                    value="fish"
                    {...register("menuChoice")}
                  />
                  <span>🐟 Pescado</span>
                </label>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className={styles.fieldGroup}>
              <label htmlFor="dietaryRestrictions">Alergias o Restricciones (Opcional)</label>
              <textarea
                {...register("dietaryRestrictions")}
                placeholder="Ej: Sin gluten, vegetariano, alergia a frutos secos..."
                className={styles.textarea}
                rows={2}
              />
            </div>

            {/* REMOVED MESSAGE FIELD */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Error */}
      {submitStatus === "error" && (
        <div className={styles.errorMessage}>
          <AlertCircle size={18} />
          <span>Hubo un error al enviar. Por favor intenta de nuevo.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? (
          <><Loader2 className={styles.spinner} size={20} /> Enviando...</>
        ) : (
          "Confirmar Asistencia"
        )}
      </button>
    </form>
  );
}
