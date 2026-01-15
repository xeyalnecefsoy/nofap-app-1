import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

export function useSobrietyTimer(startDate: Date | null) {
  const [streak, setStreak] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!startDate) return;

    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, differenceInSeconds(now, startDate));
      
      const days = Math.floor(diff / (3600 * 24));
      const hours = Math.floor((diff % (3600 * 24)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setStreak({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return streak;
}
