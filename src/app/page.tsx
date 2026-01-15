import { SobrietyCounter } from "@/components/SobrietyCounter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background text-foreground">
      <LanguageSwitcher />
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-16 relative z-10">
        <header className="text-center">
          <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-muted-foreground opacity-50">Ascend</p>
        </header>

        <SobrietyCounter />
      </div>
    </main>
  );
}
