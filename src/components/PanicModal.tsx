"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wind } from "lucide-react";
import { useState, useEffect } from "react";

export function PanicModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, language } = useLanguage();
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(4); // Start with Inhale 4s

  useEffect(() => {
    if (!isOpen) return;

    let timer: NodeJS.Timeout;

    const runCycle = () => {
      if (phase === "inhale") {
        if (timeLeft > 1) {
          setTimeLeft((prev) => prev - 1);
        } else {
          setPhase("hold");
          setTimeLeft(7);
        }
      } else if (phase === "hold") {
        if (timeLeft > 1) {
          setTimeLeft((prev) => prev - 1);
        } else {
          setPhase("exhale");
          setTimeLeft(8);
        }
      } else if (phase === "exhale") {
         if (timeLeft > 1) {
          setTimeLeft((prev) => prev - 1);
        } else {
          setPhase("inhale");
          setTimeLeft(4);
        }
      }
    };

    timer = setInterval(runCycle, 1000);
    return () => clearInterval(timer);
  }, [isOpen, phase, timeLeft]);

  if (!isOpen) return null;

  const getInstruction = () => {
    switch (phase) {
      case "inhale": return language === "az" ? "Nəfəs al..." : "Inhale...";
      case "hold": return language === "az" ? "Saxla..." : "Hold...";
      case "exhale": return language === "az" ? "Burax..." : "Exhale...";
    }
  };

  const getScale = () => {
    switch (phase) {
      case "inhale": return 1.25; // Reduce scale to prevent overlapping
      case "hold": return 1.25;
      case "exhale": return 1;
    }
  };

  const getColor = () => {
    switch (phase) {
      case "inhale": return "text-primary border-primary"; 
      case "hold": return "text-orange-400 border-orange-400";
      case "exhale": return "text-blue-400 border-blue-400";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
      >
        <button onClick={onClose} className="absolute top-6 left-6 p-2 hover:bg-muted rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center gap-16 relative">
            {/* Circle Container */}
            <motion.div 
                className={`relative w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center ${getColor()}`}
                animate={{ scale: getScale() }}
                transition={{ duration: phase === "hold" ? 0 : (phase === "inhale" ? 4 : 8), ease: "linear" }}
            >
                {/* Icon is now absolute background to avoid layout shift/overlap issues */}
                <Wind className="w-24 h-24 opacity-10 absolute pointer-events-none" />
                <span className="text-8xl font-bold tabular-nums relative z-10">{timeLeft}</span>
            </motion.div>

            <div className="text-center space-y-2 z-20">
                <h2 className="text-3xl font-light uppercase tracking-widest">{getInstruction()}</h2>
                <p className="text-muted-foreground text-sm">
                  {language === "az" ? "4-7-8 Nəfəs Texnikası" : "4-7-8 Breathing Technique"}
                </p>
            </div>
            
             <button 
                onClick={onClose}
                className="mt-4 px-8 py-3 rounded-full border border-border hover:bg-muted transition-colors text-sm font-semibold tracking-wider z-20"
            >
                {language === "az" ? "SAKİTLƏŞDİM" : "I FEEL CALMER"}
            </button>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
