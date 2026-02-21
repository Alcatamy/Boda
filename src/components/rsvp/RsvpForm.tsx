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
  childrenCount: number;
};

export default function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");
  const [rainEffect, setRainEffect] = useState(false);
  const [animalEffect, setAnimalEffect] = useState<"cow" | "fish" | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const animalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const attending = watch("attending");
  const menuChoice = watch("menuChoice");
  const hasPlusOne = watch("hasPlusOne");

  // Check for duplicate guest
  const checkDuplicate = async (firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('id')
        .or(`first_name.ilike.${firstName},last_name.ilike.${lastName}`)
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
        // Short concentrated burst for selection
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.7 }, // Start from lower down
          colors: ['#c5a059', '#D4AF37', '#ffffff']
        });
      });
      setRainEffect(false); // Stop rain if they switch
    } else if (attending === "no") {
      // Rain effect
      setRainEffect(true);
      setTimeout(() => setRainEffect(false), 5000); // 5 seconds of rain for better visibility
    }
  }, [attending]);

  // Effect: Animal animations based on menu choice
  useEffect(() => {
    if (menuChoice === "meat") {
      setAnimalEffect("cow");
      if (animalTimeoutRef.current) clearTimeout(animalTimeoutRef.current);
      animalTimeoutRef.current = setTimeout(() => setAnimalEffect(null), 3000);
    } else if (menuChoice === "fish") {
      setAnimalEffect("fish");
      if (animalTimeoutRef.current) clearTimeout(animalTimeoutRef.current);
      animalTimeoutRef.current = setTimeout(() => setAnimalEffect(null), 4000); // 4 seconds to cross
    }
  }, [menuChoice]);

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
      const { error } = await supabase
        .from('guests')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            attending: data.attending === "yes",
            dietary_restrictions: data.dietaryRestrictions || null,
            menu_choice: data.menuChoice || null,
            has_plus_one: data.hasPlusOne || false,
            plus_one_name: data.hasPlusOne ? data.plusOneName : null,
            children_count: data.childrenCount || 0,
          },
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setSubmitStatus("duplicate");
        } else {
          throw error;
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
      {/* Rain Overlay for "No" selection */}
      <AnimatePresence>
        {rainEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.rainOverlay}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 9999
            }}
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className={styles.drop} 
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${1.5 + Math.random() * 1.5}s`,
                  background: `linear-gradient(to bottom, transparent, ${i % 3 === 0 ? 'rgba(50, 80, 120, 0.8)' : i % 3 === 1 ? 'rgba(70, 100, 140, 0.7)' : 'rgba(30, 60, 100, 0.9)'})`,
                  width: `${i % 3 === 0 ? '1px' : i % 3 === 1 ? '2px' : '3px'}`,
                  height: `${i % 3 === 0 ? '20px' : i % 3 === 1 ? '25px' : '30px'}`
                }} 
              />
            ))}
          </motion.div>
        )}

        {/* Cow effect */}
        {animalEffect === "cow" && (
          <motion.div
            initial={{ y: 200, opacity: 0, rotate: -20 }}
            animate={{ y: 0, opacity: 1, rotate: [0, 15, -15, 10, -5, 0] }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.6 }}
            style={{
              position: 'fixed',
              bottom: '10%',
              left: '50%',
              marginLeft: '-75px',
              fontSize: '150px',
              pointerEvents: 'none',
              zIndex: 9999,
              filter: 'brightness(0) drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
            }}
          >
            🐄
          </motion.div>
        )}

        {/* Fish effect */}
        {animalEffect === "fish" && (
          <motion.div
            initial={{ x: '-10vw', y: '40vh' }}
            animate={{ 
              x: '110vw', 
              y: ['40vh', '35vh', '45vh', '35vh', '40vh'] 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              x: { duration: 3.5, ease: "linear" },
              y: { duration: 3.5, ease: "easeInOut" }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: '-10%',
              fontSize: '120px',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          >
            🐟
            {/* Sub-bubbles for the fish */}
            <motion.div
              animate={{ y: [-10, -60], x: [0, 10, -10, 0], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ position: 'absolute', top: '20px', right: '-30px', fontSize: '30px', filter: 'opacity(0.6)' }}
            >
              🫧
            </motion.div>
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
                  <div className={styles.menuEmoji}>🥩</div>
                  <span className={styles.menuTitle}>Carne</span>
                </label>
                <label className={`${styles.menuCard} ${menuChoice === "fish" ? styles.menuSelected : ""}`}>
                  <input
                    type="radio"
                    value="fish"
                    {...register("menuChoice")}
                    className={styles.radioInput}
                  />
                  <div className={styles.menuEmoji}>🐟</div>
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
      {validationErrors.duplicate && (
        <div className={styles.errorMessage}>
          <AlertCircle size={18} />
          <span>{validationErrors.duplicate}</span>
        </div>
      )}

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
