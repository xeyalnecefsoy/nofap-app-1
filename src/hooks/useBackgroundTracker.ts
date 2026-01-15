"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSobriety } from "@/context/SobrietyContext";
import { getRank } from "@/lib/ranks";

// 1 second of silence (WAV) - widely supported and triggers media session
const SILENT_AUDIO = "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==";

export function useBackgroundTracker(days: number, hours: number, minutes: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { startDate } = useSobriety();
  const { language } = useLanguage();
  const [isActive, setIsActive] = useState(false);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio(SILENT_AUDIO);
        audioRef.current.loop = true;
        // Preload to ensure readiness
        audioRef.current.load();
    }
  }, []);

  const toggleBackgroundMode = async () => {
    if (!audioRef.current || !startDate) return;

    if (isActive) {
      audioRef.current.pause();
      setIsActive(false);
      // Clear media session
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "none";
      }
    } else {
      try {
        await audioRef.current.play();
        setIsActive(true);
      } catch (e) {
        console.error("Audio playback failed:", e);
        // Fallback for interaction requirements: alert user if needed, but usually this is called on click so it should work.
      }
    }
  };

  // Update Media Session Metadata
  useEffect(() => {
    if (!isActive || !startDate || !("mediaSession" in navigator)) return;

    const rank = getRank(days);
    const title = language === "az" 
        ? `${days} Gün ${hours} Saat` 
        : `${days} Days ${hours} Hours`;
    
    // Ensure uppercase works correctly for AZ
    const rankLabel = language === "az" ? rank.label.az.toLocaleUpperCase('az') : rank.label.en.toUpperCase();
    const artist = language === "az"
        ? `Rütbə: ${rankLabel}`
        : `Rank: ${rankLabel}`;
    
    const album = "Ascend - NoFap Tracker";

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: album,
      artwork: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.playbackState = "playing";

  }, [days, hours, minutes, isActive, language, startDate]);

  return { toggleBackgroundMode, isActive };
}
