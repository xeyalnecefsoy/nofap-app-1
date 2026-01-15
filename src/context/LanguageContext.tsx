"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "az";

type Transitions = {
  [key in Language]: {
    readyTitle: string;
    startJourney: string;
    freeTitle: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    panicButton: string;
    stayStrong: string;
    endSession: string;
    appName: string;
  };
};

const translations: Transitions = {
  en: {
    readyTitle: "Ready to Ascend?",
    startJourney: "START JOURNEY",
    freeTitle: "Free From Addiction For",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    panicButton: "Panic Button",
    stayStrong: "STAY STRONG • ONE DAY AT A TIME",
    endSession: "End Session",
    appName: "Ascend",
  },
  az: {
    readyTitle: "Yüksəlməyə hazırsan?",
    startJourney: "BAŞLA",
    freeTitle: "Azad Olduğun Müddət",
    days: "Gün",
    hours: "Saat",
    minutes: "Dəqiqə",
    seconds: "Saniyə",
    panicButton: "Təcili Yardım",
    stayStrong: "GÜCLÜ QAL • HƏR GÜN YENİ BİR QƏLƏBƏDİR",
    endSession: "Bitir",
    appName: "Ascend",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Transitions["en"];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("ascend_language") as Language;
    if (saved && (saved === "en" || saved === "az")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ascend_language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
