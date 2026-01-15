"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getRandomQuote } from "@/lib/quotes";
import { motion } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Quote } from "@/lib/quotes";

export function DailyMotivation() {
  const { language } = useLanguage();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  if (!quote) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="max-w-md mx-auto mt-12 text-center space-y-4 px-6"
    >
      <div className="flex justify-center text-primary/20 mb-4">
        <QuoteIcon className="w-8 h-8 rotate-180" />
      </div>
      
      <p className="text-lg md:text-xl font-light italic leading-relaxed text-foreground/80">
        "{quote.text[language]}"
      </p>
      
      <div className="w-12 h-px bg-border mx-auto" />
      
      <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
        — {language === "az" ? quote.author.az.toLocaleUpperCase('az') : quote.author.en.toUpperCase()}
      </p>
    </motion.div>
  );
}
