import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlusOne {
  id: string;
  x: number;
}

interface PlusOneRainProps {
  active: boolean;
  intensity?: number;
}

export function PlusOneRain({ active, intensity = 1 }: PlusOneRainProps) {
  const [plusOnes, setPlusOnes] = useState<PlusOne[]>([]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const shouldSpawn = Math.random() < intensity * 0.3;
      if (shouldSpawn) {
        const newPlusOne: PlusOne = {
          id: `plus-${Date.now()}-${Math.random()}`,
          x: Math.random() * 100,
        };
        setPlusOnes((prev) => [...prev, newPlusOne]);

        setTimeout(() => {
          setPlusOnes((prev) => prev.filter((p) => p.id !== newPlusOne.id));
        }, 2000);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [active, intensity]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {plusOnes.map((plusOne) => (
          <motion.div
            key={plusOne.id}
            initial={{ y: 0, x: `${plusOne.x}%`, opacity: 1, scale: 1 }}
            animate={{
              y: -150,
              opacity: 0,
              scale: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute bottom-0 text-monad-400 font-bold text-2xl"
            style={{ left: `${plusOne.x}%` }}
          >
            +1
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
