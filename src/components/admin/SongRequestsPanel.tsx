"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Music, Clock, CheckCircle } from "lucide-react";
import styles from "./SongRequestsPanel.module.css";

interface SongRequest {
  id: string;
  sender_name: string;
  song_artist: string;
  status: string;
  created_at: string;
}

export default function SongRequestsPanel() {
  const [songs, setSongs] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from("song_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setSongs(data || []);
      } catch (error) {
        console.error("Error fetching song requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <span>Cargando canciones...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <Music size={20} />
          <div>
            <span className={styles.statNumber}>{songs.length}</span>
            <span className={styles.statLabel}>Canciones solicitadas</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <CheckCircle size={20} />
          <div>
            <span className={styles.statNumber}>
              {songs.filter((s) => s.status === "approved").length}
            </span>
            <span className={styles.statLabel}>Aprobadas</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Clock size={20} />
          <div>
            <span className={styles.statNumber}>
              {songs.filter((s) => s.status === "pending").length}
            </span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className={styles.emptyState}>
          <Music size={48} className={styles.emptyIcon} />
          <p>Aún no hay canciones solicitadas</p>
        </div>
      ) : (
        <div className={styles.songList}>
          {songs.map((song) => (
            <div key={song.id} className={styles.songItem}>
              <div className={styles.songInfo}>
                <span className={styles.songTitle}>🎵 {song.song_artist}</span>
                <span className={styles.songSender}>
                  Pedida por: {song.sender_name}
                </span>
              </div>
              <div className={styles.songMeta}>
                <span
                  className={`${styles.statusBadge} ${
                    song.status === "approved"
                      ? styles.approved
                      : song.status === "rejected"
                      ? styles.rejected
                      : styles.pending
                  }`}
                >
                  {song.status === "approved"
                    ? "Aprobada"
                    : song.status === "rejected"
                    ? "Rechazada"
                    : "Pendiente"}
                </span>
                <span className={styles.songDate}>
                  {new Date(song.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
