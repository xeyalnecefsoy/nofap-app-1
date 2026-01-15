"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-2 py-1 text-xs font-medium rounded-md transition-colors",
          language === "en" 
            ? "bg-primary/20 text-primary" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("az")}
        className={cn(
          "px-2 py-1 text-xs font-medium rounded-md transition-colors",
          language === "az" 
            ? "bg-primary/20 text-primary" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        AZ
      </button>
    </div>
  );
}
