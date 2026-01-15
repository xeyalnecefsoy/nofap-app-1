"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useSobriety } from "@/context/SobrietyContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Skull } from "lucide-react";
import { useState } from "react";

type RelapseReason = "stress" | "boredom" | "urge" | "social_media" | "insomnia" | "other";

export function RelapseWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, language } = useLanguage();
  const { resetTimer } = useSobriety();
  const [step, setStep] = useState<"confirm" | "shame" | "reason" | "final">("confirm");
  const [reason, setReason] = useState<RelapseReason | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const handleReset = () => {
    resetTimer();
    onClose();
    setStep("confirm");
    setReason(null);
    setConfirmText("");
  };

  const relapseReasons: { id: RelapseReason; label: string }[] = [
    { id: "stress", label: language === "az" ? "Stress / Gərginlik" : "Stress / Anxiety" },
    { id: "boredom", label: language === "az" ? "Boşluq / Bekarçılıq" : "Boredom" },
    { id: "urge", label: language === "az" ? "Ani Şəhvət" : "Sudden Urge" },
    { id: "social_media", label: language === "az" ? "Sosial Media (Instagram/TikTok)" : "Social Media Trigger" },
    { id: "insomnia", label: language === "az" ? "Yuxusuzluq" : "Insomnia" },
    { id: "other", label: language === "az" ? "Digər" : "Other" },
  ];

  const shameSentence = language === "az" ? "MƏN ZƏİFƏM" : "I AM WEAK";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-card border border-destructive/20 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-border bg-destructive/5">
            <h3 className="font-bold text-lg text-destructive uppercase tracking-widest">
              {step === "confirm" && (language === "az" ? "XƏBƏRDARLIQ" : "WARNING")}
              {step === "shame" && (language === "az" ? "MƏĞLUBİYYƏT" : "DEFEAT")}
              {step === "reason" && (language === "az" ? "SƏBƏB NƏDİR?" : "WHY?")}
              {step === "final" && (language === "az" ? "Hökm" : "VERDICT")}
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {step === "confirm" && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive animate-pulse">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-destructive">
                    {language === "az" ? "Dəqiq dayandırmaq istəyirsən?" : "Are you sure?"}
                  </h4>
                  <p className="text-muted-foreground text-sm font-medium">
                    {language === "az" 
                      ? "İradənə bu qədər tez yenildin? Başlamaq asandır, bitirmək isə yalnız zəiflərin işidir." 
                      : "Giving up so soon? Starting is easy, quitting is for the weak."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={onClose} className="py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-bold">
                    {language === "az" ? "XEYR, DAVAM EDİRƏM!" : "NO, STAY STRONG!"}
                  </button>
                  <button 
                    onClick={() => setStep("shame")} 
                    className="py-3 px-4 rounded-lg bg-transparent border border-destructive/50 text-destructive hover:bg-destructive hover:text-white transition-colors font-medium text-xs"
                  >
                    {language === "az" ? "Bəli, uduzdum..." : "Yes, I failed..."}
                  </button>
                </div>
              </div>
            )}

            {step === "shame" && (
              <div className="text-center space-y-6">
                <div>
                  <h4 className="text-2xl font-black mb-4 text-destructive uppercase">
                    {language === "az" ? "RƏZALƏT." : "DISGRACE."}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-6">
                    {language === "az"
                      ? "Özünə verdiyin sözü tuta bilmədin. Bir anlıq həzz üçün iradəni satdın. İndi aynaya necə baxacaqsan?"
                      : "You broke your promise. You traded your will for a moment of pleasure. How will you look in the mirror?"}
                  </p>
                  
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">
                      {language === "az" 
                        ? `TƏSDİQLƏMƏK ÜÇÜN "${shameSentence}" YAZ:` 
                        : `TYPE "${shameSentence}" TO CONFIRM:`}
                    </label>
                    <input 
                      type="text" 
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder={shameSentence}
                      className="w-full text-center bg-background border border-border rounded p-2 text-destructive font-bold placeholder:text-muted-foreground/20"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => confirmText.toLocaleUpperCase(language === 'az' ? 'az' : 'en').trim() === shameSentence ? setStep("reason") : null}
                  disabled={confirmText.toLocaleUpperCase(language === 'az' ? 'az' : 'en').trim() !== shameSentence}
                  className="w-full py-3 px-4 rounded-lg bg-destructive text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                >
                  {language === "az" ? "Bəli, Qəbul Edirəm" : "I Accept My Failure"}
                </button>
              </div>
            )}

            {step === "reason" && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-center text-destructive">
                  {language === "az" ? "Səni nə yıxdı?" : "What defeated you?"}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {relapseReasons.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setReason(r.id);
                        setStep("final");
                      }}
                      className="p-3 text-left text-xs font-medium border border-border rounded-lg hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "final" && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
                  <Skull className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">0 Gün.</h4>
                  <p className="text-muted-foreground text-sm">
                    {language === "az"
                      ? "Yenidən sıfırsan. Bu hissi unutma. Bu utancı yadda saxla. Növbəti dəfə əlin ora gedəndə bu anı xatırla."
                      : "Zero. Remember this feeling. Remember this shame. Recall this moment next time you feel urged."}
                  </p>
                </div>
                <button 
                  onClick={handleReset}
                  className="w-full py-3 px-4 rounded-lg border border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors font-medium text-xs uppercase tracking-widest"
                >
                  {language === "az" ? "SIFIRDAN BAŞLA (MƏĞLUB OLDUM)" : "RESTART FROM ZERO"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
