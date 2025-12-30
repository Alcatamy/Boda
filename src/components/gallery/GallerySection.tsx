"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import UploadWidget from "./UploadWidget";
import styles from "./GallerySection.module.css";
import { motion } from "framer-motion";
import Image from "next/image";

type Photo = {
  id: string;
  storage_path: string;
  caption: string;
};

export default function GallerySection() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const fetchPhotos = useCallback(async () => {
    // Only approved photos
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    setPhotos(data || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchPhotos();

    // Optional: Real-time subscription
    const channel = supabase
      .channel('public:photos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, fetchPhotos)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPhotos]);

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from('photos').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <section id="gallery" className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>Galería de Invitados</h2>
          <p className={styles.subtitle}>Comparte tus fotos del gran día con nosotros</p>
        </motion.div>

        <UploadWidget onUploadComplete={fetchPhotos} />

        <div className={styles.grid}>
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className={styles.item}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {/* Aspect Ratio Container for Masonry items. 
                  Since we don't have dimensions, we use 'auto' height but Next.js needs help.
                  We'll use width/height=0 and sizes="100vw" style trick for auto-height images */}
              <div className={styles.imageWrapper}>
                <Image
                  src={getImageUrl(photo.storage_path)}
                  alt={photo.caption || "Wedding moment"}
                  width={600}
                  height={750}
                  className={styles.image}
                  sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            </motion.div>
          ))}
          {photos.length === 0 && (
            <p className={styles.empty}>Aún no hay fotos. ¡Sé el primero en subir una!</p>
          )}
        </div>
      </div>
    </section>
  );
}
