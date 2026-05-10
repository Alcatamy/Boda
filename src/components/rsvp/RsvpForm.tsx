"use client";

import { useState, useEffect, useRef } from "react";
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
  hasPlusOne: boolean;
  plusOneName: string;
  plusOneMenuChoice: string; // "meat" | "fish"
  childrenCount: number;
};

export default function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");
  const [rainEffect, setRainEffect] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const attending = watch("attending");
  const menuChoice = watch("menuChoice");
  const hasPlusOne = watch("hasPlusOne");
  const plusOneMenuChoice = watch("plusOneMenuChoice");

  // Check for duplicate guest
  const checkDuplicate = async (firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('id')
        .ilike('first_name', firstName)
        .ilike('last_name', lastName)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  };

  // Validate form data
  const validateForm = async (data: FormData) => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!data.firstName.trim() || data.firstName.length < 2) {
      errors.firstName = "El nombre debe tener al menos 2 caracteres";
    }
    if (!data.lastName.trim() || data.lastName.length < 2) {
      errors.lastName = "Los apellidos deben tener al menos 2 caracteres";
    }

    // Plus one validation
    if (hasPlusOne && !data.plusOneName.trim()) {
      errors.plusOneName = "Por favor introduce el nombre de tu acompañante";
    }

    // Check for duplicates
    const isDuplicate = await checkDuplicate(data.firstName, data.lastName);
    if (isDuplicate) {
      errors.duplicate = "Ya hemos recibido una confirmación con estos datos. ¿Quieres modificar tu respuesta?";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Effect: Immediate visual feedback on selection
  useEffect(() => {
    if (attending === "yes") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#c5a059', '#D4AF37', '#ffffff']
        });
      });
      setRainEffect(false);
    } else if (attending === "no") {
      setRainEffect(true);
      setTimeout(() => setRainEffect(false), 4000);
    }
  }, [attending]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setValidationErrors({});

    // Validate form before submission
    const isValid = await validateForm(data);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === 'duplicate') {
          setSubmitStatus("duplicate");
        } else {
          throw new Error(result.error || "Error unknown");
        }
      } else {
        setSubmitStatus("success");
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "duplicate") {
    return (
      <div className={styles.successWrapper}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.errorMessage}
        >
          <AlertCircle size={64} className={styles.errorIcon} color="#f59e0b" />
          <h3>Respuesta Duplicada</h3>
          <p>Ya hemos recibido una confirmación con estos datos. Si necesitas modificar tu respuesta, por favor contáctanos directamente.</p>
          <div className={styles.contactInfo}>
            <p>Nadia: 646 46 14 47</p>
            <p>Adrián: 691 77 22 32</p>
          </div>
          <button
            onClick={() => setSubmitStatus("idle")}
            className={styles.resetButton}
          >
            Intentar con otros datos
          </button>
        </motion.div>
      </div>
    );
  }

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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Dramatic "No" Effect Overlay */}
      <AnimatePresence>
        {rainEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className={styles.sadOverlay}
          >
            {/* Moody gradient film */}
            <motion.div
              className={styles.moodLayer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />

            {/* Sad emoji that floats up and fades */}
            <motion.div
              className={styles.sadEmoji}
              initial={{ opacity: 0, scale: 0, y: 40 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.5, 1.5, 1], y: [40, -20, -20, -60] }}
              transition={{ duration: 3, times: [0, 0.2, 0.7, 1] }}
            >
              😢
            </motion.div>

            {/* Rain drops — 3 layers for depth */}
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={`drop-${i}`}
                className={styles.raindrop}
                initial={{ y: '-10vh', opacity: 0 }}
                animate={{ y: '110vh', opacity: [0, 0.8, 0.8, 0] }}
                transition={{
                  duration: 0.6 + Math.random() * 0.5,
                  delay: Math.random() * 1.5,
                  repeat: 3,
                  ease: 'linear',
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  width: i % 4 === 0 ? '3px' : i % 3 === 0 ? '2px' : '1.5px',
                  height: i % 4 === 0 ? '24px' : i % 3 === 0 ? '18px' : '14px',
                }}
              />
            ))}

            {/* Lightning flash */}
            <motion.div
              className={styles.lightning}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0, 0.4, 0] }}
              transition={{ duration: 0.4, delay: 1.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name Fields */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label htmlFor="firstName">Nombre *</label>
          <input
            {...register("firstName", { required: true, minLength: 2 })}
            placeholder="Tu nombre"
            className={`${styles.input} ${errors.firstName || validationErrors.firstName ? styles.inputError : ''}`}
          />
          {(errors.firstName || validationErrors.firstName) && (
            <span className={styles.error}>{validationErrors.firstName || "Requerido"}</span>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="lastName">Apellidos *</label>
          <input
            {...register("lastName", { required: true, minLength: 2 })}
            placeholder="Tus apellidos"
            className={`${styles.input} ${errors.lastName || validationErrors.lastName ? styles.inputError : ''}`}
          />
          {(errors.lastName || validationErrors.lastName) && (
            <span className={styles.error}>{validationErrors.lastName || "Requerido"}</span>
          )}
        </div>
      </div>

      {/* Attendance Radio */}
      <div className={styles.fieldGroup}>
        <label>¿Podrás acompañarnos? *</label>
        <div className={styles.radioGroup}>
          <label className={`${styles.optionYes} ${attending === "yes" ? styles.selected : ""}`}>
            <input
              type="radio"
              value="yes"
              {...register("attending", { required: true })}
              className={styles.radioInput}
            />
            <span>¡Sí, allí estaré!</span>
          </label>
          <label className={`${styles.optionNo} ${attending === "no" ? styles.selected : ""}`}>
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
              <div className={styles.menuGrid}>
                <label className={`${styles.menuCard} ${menuChoice === "meat" ? styles.menuSelected : ""}`}>
                  <input
                    type="radio"
                    value="meat"
                    {...register("menuChoice")}
                    className={styles.radioInput}
                  />
                  <motion.div
                    className={styles.menuEmoji}
                    animate={menuChoice === "meat" ? { scale: [1, 1.4, 1], y: [0, -10, 0], rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {menuChoice === "meat" ? "🐄" : "🥩"}
                  </motion.div>
                  <span className={styles.menuTitle}>Carne</span>
                </label>
                <label className={`${styles.menuCard} ${menuChoice === "fish" ? styles.menuSelected : ""}`}>
                  <input
                    type="radio"
                    value="fish"
                    {...register("menuChoice")}
                    className={styles.radioInput}
                  />
                  <motion.div
                    className={styles.menuEmoji}
                    animate={menuChoice === "fish" ? { scale: [1, 1.4, 1], y: [0, -10, 0], rotate: [0, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    🐟
                  </motion.div>
                  <span className={styles.menuTitle}>Pescado</span>
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

            {/* Plus One Option */}
            <div className={styles.fieldGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  {...register("hasPlusOne")}
                  className={styles.checkbox}
                />
                <span>Vendrás con acompañante?</span>
              </label>
            </div>

            {/* Plus One Name */}
            <AnimatePresence>
              {hasPlusOne && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={styles.conditionalFields}
                >
                  <div className={styles.fieldGroup}>
                    <label htmlFor="plusOneName">Nombre del Acompañante *</label>
                    <input
                      {...register("plusOneName", { required: hasPlusOne })}
                      placeholder="Nombre de tu acompañante"
                      className={`${styles.input} ${errors.plusOneName || validationErrors.plusOneName ? styles.inputError : ''}`}
                    />
                    {(errors.plusOneName || validationErrors.plusOneName) && (
                      <span className={styles.error}>{validationErrors.plusOneName || "Requerido si vienes con acompañante"}</span>
                    )}
                  </div>

                  {/* Plus One Menu Choice */}
                  <div className={styles.fieldGroup}>
                    <label><Utensils size={16} /> Menú del acompañante</label>
                    <div className={styles.menuGrid}>
                      <label className={`${styles.menuCard} ${plusOneMenuChoice === "meat" ? styles.menuSelected : ""}`}>
                        <input
                          type="radio"
                          value="meat"
                          {...register("plusOneMenuChoice", { required: hasPlusOne })}
                          className={styles.radioInput}
                        />
                        <motion.div
                          className={styles.menuEmoji}
                          animate={plusOneMenuChoice === "meat" ? { scale: [1, 1.4, 1], y: [0, -10, 0], rotate: [0, -10, 10, 0] } : {}}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                           🐄
                        </motion.div>
                        <span className={styles.menuTitle}>Carne</span>
                      </label>
                      <label className={`${styles.menuCard} ${plusOneMenuChoice === "fish" ? styles.menuSelected : ""}`}>
                        <input
                          type="radio"
                          value="fish"
                          {...register("plusOneMenuChoice", { required: hasPlusOne })}
                          className={styles.radioInput}
                        />
                        <motion.div
                          className={styles.menuEmoji}
                          animate={plusOneMenuChoice === "fish" ? { scale: [1, 1.4, 1], y: [0, -10, 0], rotate: [0, 15, -15, 0] } : {}}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          🐟
                        </motion.div>
                        <span className={styles.menuTitle}>Pescado</span>
                      </label>
                    </div>
                    {errors.plusOneMenuChoice && (
                      <span className={styles.error}>Por favor selecciona el menú del acompañante</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Children Count */}
            <div className={styles.fieldGroup}>
              <label htmlFor="childrenCount">¿Cuántos niños vienen?</label>
              <select
                {...register("childrenCount", { valueAsNumber: true })}
                className={styles.select}
              >
                <option value={0}>Ninguno</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4+</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Error */}
      {
        validationErrors.duplicate && (
          <div className={styles.errorMessage}>
            <AlertCircle size={18} />
            <span>{validationErrors.duplicate}</span>
          </div>
        )
      }

      {
        submitStatus === "error" && (
          <div className={styles.errorMessage}>
            <AlertCircle size={18} />
            <span>Hubo un error al enviar. Por favor intenta de nuevo.</span>
          </div>
        )
      }

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
    </form >
  );
}
