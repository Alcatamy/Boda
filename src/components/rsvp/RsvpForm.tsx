"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, AlertCircle, Utensils } from "lucide-react";
import styles from "./RsvpForm.module.css";

type FormData = {
  firstName: string;
  lastName: string;
  attending: string; // "yes" | "no"
  dietaryRestrictions: string;
  menuChoice: string; // "meat" | "fish"
  message: string;
};

export default function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const attending = watch("attending");
  const menuChoice = watch("menuChoice");

  useEffect(() => {
    if (submitStatus === "success") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#e7e5e4', '#ffffff']
      });
    }
  }, [submitStatus]);

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
            message: data.message,
            // has_plus_one and plus_one_name removed
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.successMessage}
      >
        <CheckCircle size={64} className={styles.successIcon} />
        <h3>¡Gracias por confirmar!</h3>
        <p>Hemos recibido tu respuesta y selección de menú correctamente.</p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className={styles.resetButton}
        >
          Enviar otra respuesta
        </button>
      </motion.div>
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
          <label htmlFor="lastName">Apellido *</label>
          <input
            {...register("lastName", { required: true })}
            placeholder="Tu apellido"
            className={styles.input}
          />
          {errors.lastName && <span className={styles.error}>Requerido</span>}
        </div>
      </div>

      {/* Attendance */}
      <div className={styles.fieldGroup}>
        <label>¿Podrás acompañarnos? *</label>
        <div className={styles.radioGroup}>
          <label className={`${styles.radioLabel} ${attending === "yes" ? styles.selected : ""}`}>
            <input
              type="radio"
              value="yes"
              {...register("attending", { required: true })}
              className={styles.radioInput}
            />
            <span>¡Sí, allí estaré!</span>
          </label>
          <label className={`${styles.radioLabel} ${attending === "no" ? styles.selected : ""}`}>
            <input
              type="radio"
              value="no"
              {...register("attending", { required: true })}
              className={styles.radioInput}
            />
            <span>Lo siento, no podré ir</span>
          </label>
        </div>
        {errors.attending && <span className={styles.error}>Por favor selecciona una opción</span>}
      </div>

      {/* Conditional Fields */}
      <AnimatePresence>
        {attending === "yes" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.conditionalSection}
          >
            {/* Menu Selection */}
            <div className={styles.fieldGroup}>
              <label>Elección de Menú Principal <Utensils size={14} style={{ marginLeft: 8, opacity: 0.7 }} /></label>
              <div className={styles.menuGrid}>
                <label className={`${styles.menuCard} ${menuChoice === "meat" ? styles.menuSelected : ""}`}>
                  <input
                    type="radio"
                    value="meat"
                    {...register("menuChoice", { required: true })}
                    className={styles.hiddenRadio}
                  />
                  <div className={styles.menuEmoji}>🥩</div>
                  <span className={styles.menuTitle}>Carne</span>
                </label>

                <label className={`${styles.menuCard} ${menuChoice === "fish" ? styles.menuSelected : ""}`}>
                  <input
                    type="radio"
                    value="fish"
                    {...register("menuChoice", { required: true })}
                    className={styles.hiddenRadio}
                  />
                  <div className={styles.menuEmoji}>🐟</div>
                  <span className={styles.menuTitle}>Pescado</span>
                </label>
              </div>
              {errors.menuChoice && <span className={styles.error}>Elige tu plato principal</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="dietaryRestrictions">Alergias, Intolerancias o Especificaciones</label>
              <textarea
                {...register("dietaryRestrictions")}
                placeholder="Ej: Sin gluten, Vegano, Alergia a nueces..."
                className={styles.textarea}
                rows={2}
              />
            </div>
            {/* Removed Plus One Checkbox and Logic */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message */}
      <div className={styles.fieldGroup}>
        <label htmlFor="message">Mensaje para los novios (Opcional)</label>
        <textarea
          {...register("message")}
          placeholder="Déjanos un mensaje..."
          className={styles.textarea}
          rows={3}
        />
      </div>

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
