"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./RsvpForm.module.css";

type FormData = {
  firstName: string;
  lastName: string;
  attending: string; // "yes" | "no"
  dietaryRestrictions: string;
  hasPlusOne: boolean;
  plusOneName: string;
  message: string;
};

export default function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const attending = watch("attending");
  const hasPlusOne = watch("hasPlusOne");

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
            has_plus_one: data.hasPlusOne,
            plus_one_name: data.plusOneName,
            message: data.message,
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
        <p>Hemos recibido tu respuesta correctamente.</p>
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
            <div className={styles.fieldGroup}>
              <label htmlFor="dietaryRestrictions">Alergias o Restricciones Alimentarias</label>
              <textarea 
                {...register("dietaryRestrictions")} 
                placeholder="Ej: Vegetariano, alergia a nueces..."
                className={styles.textarea}
                rows={2}
              />
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  {...register("hasPlusOne")} 
                  className={styles.checkbox}
                />
                <span>¿Llevas acompañante? (+1)</span>
              </label>
            </div>

            {hasPlusOne && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.fieldGroup}
              >
                <label htmlFor="plusOneName">Nombre del Acompañante</label>
                <input 
                  {...register("plusOneName")} 
                  placeholder="Nombre completo"
                  className={styles.input}
                />
              </motion.div>
            )}
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
