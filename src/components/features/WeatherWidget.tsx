"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, MapPin } from "lucide-react";
import styles from "./WeatherWidget.module.css";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  date: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wedding location: Colmenar Viejo, Madrid
  const weddingLocation = "Colmenar Viejo, Madrid, Spain";
  const weddingDate = "2026-07-25";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // Using OpenWeatherMap API (you'll need to add API key to .env.local)
        // For demo purposes, we'll use mock data that looks realistic
        const mockWeatherData: WeatherData = {
          location: weddingLocation,
          temperature: 32,
          condition: "Sunny",
          humidity: 35,
          windSpeed: 12,
          icon: "sunny",
          date: weddingDate
        };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWeather(mockWeatherData);
        setError(null);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("No se pudo cargar el pronóstico del tiempo");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun size={48} className={styles.weatherIcon} />;
      case "cloudy":
        return <Cloud size={48} className={styles.weatherIcon} />;
      case "rainy":
        return <CloudRain size={48} className={styles.weatherIcon} />;
      default:
        return <Sun size={48} className={styles.weatherIcon} />;
    }
  };

  const getWeatherBackground = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      case "cloudy":
        return "linear-gradient(135deg, #667eea 0%, #94a3b8 100%)";
      case "rainy":
        return "linear-gradient(135deg, #475569 0%, #1e293b 100%)";
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  };

  if (loading) {
    return (
      <motion.div 
        className={styles.weatherWidget}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Cargando pronóstico...</span>
        </div>
      </motion.div>
    );
  }

  if (error || !weather) {
    return (
      <motion.div 
        className={styles.weatherWidget}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.error}>
          <Cloud size={32} />
          <span>{error || "Pronóstico no disponible"}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={styles.weatherWidget}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ background: getWeatherBackground(weather.condition) }}
    >
      <div className={styles.weatherHeader}>
        <div className={styles.locationInfo}>
          <MapPin size={16} />
          <span className={styles.location}>{weather.location}</span>
        </div>
        <div className={styles.dateInfo}>
          <span>{new Date(weather.date).toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <div className={styles.weatherMain}>
        <div className={styles.temperatureSection}>
          {getWeatherIcon(weather.condition)}
          <div className={styles.temperature}>
            <span className={styles.tempValue}>{weather.temperature}°</span>
            <span className={styles.tempUnit}>C</span>
          </div>
          <span className={styles.condition}>{weather.condition}</span>
        </div>

        <div className={styles.weatherDetails}>
          <div className={styles.detailItem}>
            <Droplets size={20} className={styles.detailIcon} />
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Humedad</span>
              <span className={styles.detailValue}>{weather.humidity}%</span>
            </div>
          </div>
          
          <div className={styles.detailItem}>
            <Wind size={20} className={styles.detailIcon} />
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Viento</span>
              <span className={styles.detailValue}>{weather.windSpeed} km/h</span>
            </div>
          </div>

          <div className={styles.detailItem}>
            <Thermometer size={20} className={styles.detailIcon} />
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Sensación</span>
              <span className={styles.detailValue}>{weather.temperature + 2}°C</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.weatherFooter}>
        <div className={styles.outfitSuggestion}>
          <span className={styles.suggestionIcon}>👔</span>
          <span className={styles.suggestionText}>
            {weather.temperature > 30 
              ? "Viste ropa ligera y fresca" 
              : weather.temperature > 20 
              ? "Viste ropa cómoda y elegante" 
              : "Considera una chaqueta ligera"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
