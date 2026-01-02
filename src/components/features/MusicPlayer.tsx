"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Music, List } from "lucide-react";
import styles from "./MusicPlayer.module.css";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover: string;
  url: string;
}

// Wedding playlist - you can customize this
const weddingPlaylist: Song[] = [
  {
    id: "1",
    title: "Perfect",
    artist: "Ed Sheeran",
    duration: 263,
    cover: "/images/music/cover1.jpg",
    url: "/music/perfect.mp3"
  },
  {
    id: "2", 
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    duration: 281,
    cover: "/images/music/cover2.jpg",
    url: "/music/thinking-out-loud.mp3"
  },
  {
    id: "3",
    title: "All of Me",
    artist: "John Legend",
    duration: 269,
    cover: "/images/music/cover3.jpg", 
    url: "/music/all-of-me.mp3"
  },
  {
    id: "4",
    title: "A Thousand Years",
    artist: "Christina Perri",
    duration: 285,
    cover: "/images/music/cover4.jpg",
    url: "/music/a-thousand-years.mp3"
  },
  {
    id: "5",
    title: "Can't Help Falling in Love",
    artist: "Elvis Presley",
    duration: 178,
    cover: "/images/music/cover5.jpg",
    url: "/music/cant-help-falling.mp3"
  }
];

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = weddingPlaylist[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentSongIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.log('Audio play failed:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % weddingPlaylist.length;
    setCurrentSongIndex(nextIndex);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const prevIndex = currentSongIndex === 0 ? weddingPlaylist.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleFavorite = (songId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
    } else {
      newFavorites.add(songId);
    }
    setFavorites(newFavorites);
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setShowPlaylist(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = currentSong.duration > 0 ? (currentTime / currentSong.duration) * 100 : 0;

  return (
    <motion.div 
      className={styles.musicPlayer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <audio 
        ref={audioRef}
        src={currentSong.url}
        onLoadedMetadata={(e) => {
          const audio = e.target as HTMLAudioElement;
          audio.currentTime = currentTime;
        }}
      />

      {/* Header */}
      <div className={styles.playerHeader}>
        <div className={styles.headerLeft}>
          <Music size={24} className={styles.musicIcon} />
          <div>
            <h3 className={styles.playerTitle}>Nuestra Playlist</h3>
            <p className={styles.playerSubtitle}>Las canciones de nuestra historia</p>
          </div>
        </div>
        <button 
          className={styles.playlistToggle}
          onClick={() => setShowPlaylist(!showPlaylist)}
        >
          <List size={20} />
        </button>
      </div>

      {/* Current Song Info */}
      <div className={styles.currentSong}>
        <div className={styles.songCover}>
          <motion.img
            src={currentSong.cover}
            alt={currentSong.title}
            className={styles.coverImage}
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          />
          <div className={styles.coverOverlay} />
        </div>
        
        <div className={styles.songInfo}>
          <h4 className={styles.songTitle}>{currentSong.title}</h4>
          <p className={styles.songArtist}>{currentSong.artist}</p>
          <button 
            className={styles.favoriteBtn}
            onClick={() => toggleFavorite(currentSong.id)}
          >
            <Heart 
              size={20} 
              className={favorites.has(currentSong.id) ? styles.favorited : ''}
              fill={favorites.has(currentSong.id) ? '#e11d48' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
        <div className={styles.progressBar}>
          <input
            type="range"
            min="0"
            max={currentSong.duration}
            value={currentTime}
            onChange={handleSeek}
            className={styles.progressSlider}
          />
          <div 
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.timeLabel}>{formatTime(currentSong.duration)}</span>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={handlePrevious}>
          <SkipBack size={20} />
        </button>
        
        <button className={styles.playBtn} onClick={togglePlay}>
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Pause size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Play size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        
        <button className={styles.controlBtn} onClick={handleNext}>
          <SkipForward size={20} />
        </button>
      </div>

      {/* Volume Control */}
      <div className={styles.volumeControl}>
        <Volume2 size={18} className={styles.volumeIcon} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className={styles.volumeSlider}
        />
      </div>

      {/* Playlist */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            className={styles.playlist}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h5 className={styles.playlistTitle}>Playlist Completa</h5>
            <div className={styles.playlistItems}>
              {weddingPlaylist.map((song, index) => (
                <div
                  key={song.id}
                  className={`${styles.playlistItem} ${index === currentSongIndex ? styles.active : ''}`}
                  onClick={() => selectSong(index)}
                >
                  <img src={song.cover} alt={song.title} className={styles.playlistCover} />
                  <div className={styles.playlistInfo}>
                    <span className={styles.playlistSongTitle}>{song.title}</span>
                    <span className={styles.playlistArtist}>{song.artist}</span>
                  </div>
                  <div className={styles.playlistActions}>
                    <button 
                      className={styles.playlistFavorite}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song.id);
                      }}
                    >
                      <Heart 
                        size={16} 
                        className={favorites.has(song.id) ? styles.favorited : ''}
                        fill={favorites.has(song.id) ? '#e11d48' : 'none'}
                      />
                    </button>
                    <span className={styles.playlistDuration}>{formatTime(song.duration)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
