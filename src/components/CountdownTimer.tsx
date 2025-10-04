import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatTime } from "../lib/ev";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  endTs: number;
  onEnd?: () => void;
}

export function CountdownTimer({ endTs, onEnd }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(endTs - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = endTs - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onEnd?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTs, onEnd]);

  const isUrgent = timeLeft <= 10000 && timeLeft > 0;
  const isExpired = timeLeft <= 0;

  return (
    <div
      className={`flex items-center justify-center gap-2 text-2xl font-bold ${
        isExpired
          ? "text-red-500"
          : isUrgent
          ? "text-orange-400"
          : "text-gray-300"
      }`}
    >
      <Clock className={`w-6 h-6 ${isUrgent ? "animate-pulse" : ""}`} />
      <motion.span
        animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {timeLeft > 0 ? formatTime(timeLeft) : "BITTI"}
      </motion.span>
    </div>
  );
}
