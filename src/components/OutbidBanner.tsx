import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";

interface OutbidBannerProps {
  show: boolean;
  onDismiss: () => void;
}

export function OutbidBanner({ show, onDismiss }: OutbidBannerProps) {
  const { settings } = useStore();
  const t = useTranslation(settings.language);

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timeout);
    }
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div
            role="alert"
            aria-live="assertive"
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-down"
          >
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-lg">{t.auction.outbid}</div>
            </div>
            <button
              onClick={onDismiss}
              className="text-white/80 hover:text-white transition"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
