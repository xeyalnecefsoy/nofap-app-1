"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { X, Check, History } from "lucide-react";
import { useSobriety } from "@/context/SobrietyContext";

interface LegacyStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegacyStatsModal({ isOpen, onClose }: LegacyStatsModalProps) {
  const { t } = useLanguage();
  const { setStartDate } = useSobriety();
  
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const d = parseInt(days) || 0;
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;

    if (d === 0 && h === 0 && m === 0) return;

    const now = new Date();
    // Calculate the past date: now - duration
    const pastDate = new Date(now.getTime() - (d * 24 * 60 * 60 * 1000) - (h * 60 * 60 * 1000) - (m * 60 * 1000));
    
    setStartDate(pastDate);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/10 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <History className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">{t.enterPreviousDuration}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <p className="text-sm text-primary/80 text-center font-medium">
                     {t.beHonest}
                  </p>
               </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
                    {t.days}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-center text-2xl font-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
                    {t.hours}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-center text-2xl font-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
                    {t.minutes}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                     className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-center text-2xl font-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                 <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!days && !hours && !minutes}
                  className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Check className="w-4 h-4" />
                  {t.confirm}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
