"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSobriety } from "@/context/SobrietyContext";
import { getRank } from "@/lib/ranks";

// Valid minimal silent WAV
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
        audioRef.current.load();
    }
  }, []);

  const toggleBackgroundMode = async () => {
    if (!audioRef.current || !startDate) return;

    if (isActive) {
      audioRef.current.pause();
      setIsActive(false);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "none";
      }
    } else {
      try {
        await audioRef.current.play();
        setIsActive(true);
      } catch (e: any) {
        console.error("Audio playback failed:", e);
        // User feedback for "button not working"
        alert(language === "az" ? "Xəta: Brauzer audio oynadılmasına icazə vermir. Zəhmət olmasa səhifəyə toxunun." : "Error: Browser blocked audio. Please interact with the page first.");
      }
    }
  };

  // Update Media Session Metadata & Handlers
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
    
    const album = "Ascend";

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: album,
      artwork: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });

    // CRITICAL: Registering action handlers is often required for the notification to show up on Android
    navigator.mediaSession.setActionHandler('play', () => {
        if(audioRef.current) { audioRef.current.play(); setIsActive(true); }
    });
    navigator.mediaSession.setActionHandler('pause', () => {
        if(audioRef.current) { audioRef.current.pause(); setIsActive(false); }
    });
    navigator.mediaSession.setActionHandler('stop', () => {
         if(audioRef.current) { audioRef.current.pause(); setIsActive(false); }
    });

    navigator.mediaSession.playbackState = "playing";

  }, [days, hours, minutes, isActive, language, startDate]);

  return { toggleBackgroundMode, isActive };
}
