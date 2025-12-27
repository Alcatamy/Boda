"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./UploadWidget.module.css";

export default function UploadWidget({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Insert record in DB
      // Get public URL (we don't strictly need it here if we use storage_path)
       supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('photos')
        .insert([
          { 
            storage_path: filePath,
            // In a real app we might verify content, for now we default to unapproved or approved based on preference
            // Setting is_approved to false for moderation queue
            is_approved: false, 
            caption: "Guest Upload",
            // We could store the full URL if we updated the schema, or just the path. 
            // The schema has 'storage_path', let's stick to that or 'url' if we changed it.
            // Let's assume we want to store the URL if possible, or computing it.
            // Checking schema from previous steps: table 'photos' has 'storage_path'. 
            // We will stick to storage_path.
          }
        ]);

      if (dbError) throw dbError;

      setStatus("success");
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        setStatus("idle");
        onUploadComplete();
      }, 3000);

    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.widget}>
      <AnimatePresence>
        {!preview ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className={styles.dropzone}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={32} className={styles.icon} />
            <p>Comparte tu foto</p>
            <span className={styles.subtext}>Toca para seleccionar</span>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className={styles.previewContainer}
          >
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <button 
              className={styles.removeBtn} 
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
            >
              <X size={16} />
            </button>
            <button 
              className={styles.uploadBtn} 
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? <Loader2 className={styles.spinner} /> : <Upload size={18} />}
              {uploading ? "Subiendo..." : "Publicar"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/*" 
        className={styles.hiddenInput}
      />

      {status === "success" && (
        <motion.div className={styles.toast} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Check size={16} /> Foto enviada a moderación
        </motion.div>
      )}
    </div>
  );
}
