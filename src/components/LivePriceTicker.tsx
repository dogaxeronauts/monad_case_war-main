import { motion, AnimatePresence } from "framer-motion";
import { formatMon } from "../lib/ev";
import { useEffect, useState } from "react";

interface LivePriceTickerProps {
  price: number;
}

export function LivePriceTicker({ price }: LivePriceTickerProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timeout);
  }, [price]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={price}
          initial={{ scale: 1 }}
          animate={animate ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-6xl md:text-8xl font-bold text-white text-center"
        >
          {formatMon(price)}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-monad/20 blur-3xl -z-10 animate-pulse-glow" />
    </div>
  );
}
