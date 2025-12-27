"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, Loader2 } from "lucide-react";
import styles from "./PhotoModeration.module.css";
import Image from "next/image";

type Photo = {
  id: string;
  storage_path: string;
  created_at: string;
};

export default function PhotoModeration() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPhotos = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });
    
    setPhotos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchPendingPhotos();
  }, [fetchPendingPhotos]);

  const approvePhoto = async (id: string) => {
    await supabase.from('photos').update({ is_approved: true }).eq('id', id);
    fetchPendingPhotos();
  };

  const deletePhoto = async (id: string, storagePath: string) => {
    // Delete from storage
    await supabase.storage.from('photos').remove([storagePath]);
    // Delete from DB
    await supabase.from('photos').delete().eq('id', id);
    fetchPendingPhotos();
  };

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from('photos').getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) return <div className={styles.loading}><Loader2 className={styles.spinner}/> Cargando fotos...</div>;
  if (photos.length === 0) return <div className={styles.empty}>No hay fotos pendientes de moderación.</div>;

  return (
    <div className={styles.grid}>
      {photos.map((photo) => (
        <div key={photo.id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image 
              src={getImageUrl(photo.storage_path)} 
              alt="Pending photo" 
              width={300} 
              height={300} 
              className={styles.image}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.actions}>
            <button 
              onClick={() => deletePhoto(photo.id, photo.storage_path)} 
              className={styles.rejectBtn}
              title="Borrar"
            >
              <X size={20} />
            </button>
            <button 
              onClick={() => approvePhoto(photo.id)} 
              className={styles.approveBtn}
              title="Aprobar"
            >
              <Check size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
