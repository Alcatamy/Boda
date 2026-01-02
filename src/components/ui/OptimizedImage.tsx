"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./OptimizedImage.module.css";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill";
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 75,
  placeholder = "blur",
  blurDataURL,
  aspectRatio,
  objectFit = "cover",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate blur data URL if not provided
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
    if (!canvas) return undefined;
    
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f5f5f4';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const imageProps = {
    src,
    alt,
    priority,
    quality,
    placeholder: placeholder as "blur" | "empty",
    blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    sizes,
    onLoad: handleLoad,
    onError: handleError,
    className: `${styles.image} ${isLoading ? styles.loading : ''} ${className}`,
  };

  if (fill) {
    return (
      <div className={`${styles.imageContainer} ${aspectRatio ? styles[aspectRatio] : ''} ${className}`}>
        <Image
          {...imageProps}
          fill
          style={{ objectFit }}
          sizes={sizes}
        />
        {isLoading && (
          <motion.div
            className={styles.skeleton}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
          />
        )}
        {hasError && (
          <div className={styles.errorFallback}>
            <span>Imagen no disponible</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.imageContainer} ${aspectRatio ? styles[aspectRatio] : ''} ${className}`}>
      <Image
        {...imageProps}
        width={width}
        height={height}
        style={{ objectFit }}
      />
      {isLoading && (
        <motion.div
          className={styles.skeleton}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0 }}
        />
      )}
      {hasError && (
        <div className={styles.errorFallback}>
          <span>Imagen no disponible</span>
        </div>
      )}
    </div>
  );
}
