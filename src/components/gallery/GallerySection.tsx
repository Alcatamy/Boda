"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./GallerySection.module.css";
import { motion } from "framer-motion";
import Image from "next/image";

import UploadWidget from "./UploadWidget";

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

    // Real-time subscription
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
          <p className={styles.subtitle}>Recuerdos de nuestro gran día</p>
        </motion.div>

        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
          <UploadWidget onUploadComplete={fetchPhotos} />
        </div>

        <div className={styles.grid}>
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className={styles.item}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
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
            <p className={styles.empty}>Aún no hay fotos disponibles.</p>
          )}
        </div>
      </div>
    </section>
  );
}
