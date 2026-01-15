"use client";

import { useSobriety } from "@/context/SobrietyContext";
import { useSobrietyTimer } from "@/hooks/useSobrietyTimer";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Play, Square, ShieldAlert } from "lucide-react";

import { RelapseWizard } from "@/components/RelapseWizard";
import { PanicModal } from "@/components/PanicModal";
import { DailyMotivation } from "@/components/DailyMotivation";
import { useState, useEffect } from "react";
import { getRank } from "@/lib/ranks";
import { Bell, Radio } from "lucide-react";
import { useBackgroundTracker } from "@/hooks/useBackgroundTracker";

export function SobrietyCounter() {
  const { startDate, startTimer, stopTimer } = useSobriety();
  const { t, language } = useLanguage();
  const streak = useSobrietyTimer(startDate);
  const [isRelapseWizardOpen, setIsRelapseWizardOpen] = useState(false);
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState("default");
  
  const { toggleBackgroundMode, isActive: isBackgroundActive } = useBackgroundTracker(streak.days, streak.hours, streak.minutes);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotification = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
       new Notification("Ascend", { body: language === "az" ? "Bildirişlər aktiv edildi. Güclü qal!" : "Notifications enabled. Stay strong!" });
    }
  };

  const rank = getRank(streak.days);

  if (!startDate) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <h2 className="text-xl md:text-2xl font-light text-muted-foreground">{t.readyTitle}</h2>
          <button
            onClick={startTimer}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium tracking-wide transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] min-w-[200px]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span className="text-center">{t.startJourney}</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 relative group/counter">
       {/* Top Left Controls */}
       <div className="absolute top-0 left-0 flex flex-col gap-2">
          {notificationPermission !== 'granted' && (
             <button onClick={requestNotification} className="p-2 text-muted-foreground/50 hover:text-primary transition-colors" title={language === "az" ? "Xatırlatmaları aç" : "Enable Reminders"}>
                <Bell className="w-4 h-4" />
             </button>
          )}
          
          <button 
            onClick={toggleBackgroundMode} 
            className={`p-2 transition-colors duration-500 ${isBackgroundActive ? "text-green-500 animate-pulse" : "text-muted-foreground/50 hover:text-primary"}`}
            title={language === "az" ? "Arxa Fon Rejimi (Bildiriş Panelində Göstər)" : "Background Mode (Show in Notification Panel)"}
          >
             <Radio className="w-4 h-4" />
          </button>
       </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <h2 className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-medium">{t.freeTitle}</h2>
        
        <div className="flex flex-col items-center">
            <span className="text-8xl md:text-9xl font-bold text-primary tabular-nums tracking-tighter leading-none">
              {streak.days}
            </span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em] mt-2">{t.days}</span>
        </div>
        
        {/* Rank Display */}
        <div className={`text-sm font-bold tracking-[0.3em] ${rank.color} mt-4 px-4 py-1 border border-current rounded-full opacity-80 uppercase`}>
           {language === "az" ? rank.label.az.toLocaleUpperCase('az') : rank.label.en.toUpperCase()}
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-8 md:gap-12 w-full max-w-xs mx-auto">
        <TimeUnit value={streak.hours} label={t.hours} delay={0.1} />
        <TimeUnit value={streak.minutes} label={t.minutes} delay={0.2} />
        <TimeUnit value={streak.seconds} label={t.seconds} delay={0.3} />
      </div>

      <div className="space-y-8 flex flex-col items-center w-full pt-8">
        <button 
          onClick={() => setIsPanicOpen(true)}
          className="cursor-pointer group relative w-full py-5 px-8 bg-destructive/5 hover:bg-destructive/10 border border-destructive/10 hover:border-destructive/30 text-destructive rounded-xl transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-sm overflow-hidden shadow-[0_0_0_1px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] active:scale-[0.98]"
        >
           <ShieldAlert className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" />
           <span className="text-xs font-bold tracking-[0.15em] relative z-10 uppercase">{language === "az" ? "TƏCİLİ YARDIM" : t.panicButton.toUpperCase()}</span>
        </button>
        
        <p className="text-[10px] text-center text-muted-foreground/30 font-medium tracking-wide">
            {t.stayStrong}
        </p>

        <button 
           onClick={() => setIsRelapseWizardOpen(true)}
           className="text-[10px] text-muted-foreground/20 hover:text-destructive/50 transition-colors cursor-pointer"
        >
          Reset / I Slipped Up
        </button>
      </div>

      <RelapseWizard 
        isOpen={isRelapseWizardOpen} 
        onClose={() => setIsRelapseWizardOpen(false)} 
      />

      <PanicModal
        isOpen={isPanicOpen}
        onClose={() => setIsPanicOpen(false)}
      />

      <PanicModal
        isOpen={isPanicOpen}
        onClose={() => setIsPanicOpen(false)}
      />

      <div className="w-full pt-8 pb-4">
        <DailyMotivation />
      </div>
    </div>
  );
}

function TimeUnit({ value, label, delay }: { value: number; label: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center space-y-1"
    >
      <span className="text-2xl md:text-3xl font-light text-foreground tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}
