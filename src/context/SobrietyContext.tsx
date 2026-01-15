"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type SobrietyContextType = {
  startDate: Date | null;
  startTimer: () => void;
  resetTimer: () => void;
  stopTimer: () => void;
};

const SobrietyContext = createContext<SobrietyContextType | undefined>(undefined);

export function SobrietyProvider({ children }: { children: React.ReactNode }) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  
  useEffect(() => {
    // Check localStorage on mount, but DO NOT auto-start if empty
    const saved = localStorage.getItem("ascend_start_date");
    if (saved) {
      setStartDate(new Date(saved));
    }
  }, []);

  const startTimer = () => {
    const now = new Date();
    setStartDate(now);
    localStorage.setItem("ascend_start_date", now.toISOString());
  };

  const resetTimer = () => {
    const now = new Date();
    setStartDate(now);
    localStorage.setItem("ascend_start_date", now.toISOString());
  };

  const stopTimer = () => {
    setStartDate(null);
    localStorage.removeItem("ascend_start_date");
  };

  return (
    <SobrietyContext.Provider value={{ startDate, startTimer, resetTimer, stopTimer }}>
      {children}
    </SobrietyContext.Provider>
  );
}

export function useSobriety() {
  const context = useContext(SobrietyContext);
  if (!context) {
    throw new Error("useSobriety must be used within a SobrietyProvider");
  }
  return context;
}
