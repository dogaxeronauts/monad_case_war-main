import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";
import { RarityChip } from "../components/RarityChip";
import { formatMon, RARITY_GLOW } from "../lib/ev";

export function RevealPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auctions, wonAuctions, settings } = useStore();
  const t = useTranslation(settings.language);

  const auction = auctions.find((a) => a.id === id);
  const hasWon = wonAuctions.includes(id || "");

  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!auction || !hasWon) return;

    setShowConfetti(true);

    auction.items.forEach((item, index) => {
      setTimeout(() => {
        setRevealedItems((prev) => new Set([...prev, item.id]));
      }, index * 400);
    });
  }, [auction, hasWon]);

  if (!auction || !hasWon) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Bu açık artırmayı kazanmadınız</h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-monad-gradient text-white font-semibold rounded-lg"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const totalValue = auction.evMon.exact;
  const paidAmount = auction.currentPriceMon;
  const difference = totalValue - paidAmount;
  const isProfit = difference > 0;

  return (
    <div className="min-h-screen bg-gray-900 pt-16 relative overflow-hidden">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 360,
                opacity: 0,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 bg-monad rounded-full"
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-monad-gradient rounded-full text-white font-bold text-2xl mb-4"
          >
            <Sparkles className="w-8 h-8" />
            {t.reveal.title}
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">{auction.title}</h1>
          <p className="text-gray-400">Kasayı açıyoruz...</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {auction.items.map((item, index) => {
            const isRevealed = revealedItems.has(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, rotateY: 0 }}
                animate={
                  isRevealed
                    ? { opacity: 1, rotateY: 180 }
                    : { opacity: 1, rotateY: 0 }
                }
                transition={{ duration: 0.6, delay: index * 0.4 }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`bg-gray-800 backdrop-blur-sm border-2 rounded-xl p-4 ${
                    isRevealed
                      ? `border-${item.rarity} shadow-lg ${RARITY_GLOW[item.rarity]}`
                      : "border-white/10"
                  }`}
                  style={{
                    transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {isRevealed ? (
                    <div style={{ transform: "scaleX(-1)" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full aspect-square object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-white font-bold mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <RarityChip rarity={item.rarity} size="md" />
                        <div className="text-monad-400 font-bold">
                          {formatMon(item.estValueMon)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center">
                      <div className="w-16 h-16 bg-monad/20 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: auction.items.length * 0.4 + 1 }}
          className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8"
        >
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t.reveal.totalValue}:</span>
              <span className="text-2xl font-bold text-white">{formatMon(totalValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t.reveal.paidAmount}:</span>
              <span className="text-2xl font-bold text-white">{formatMon(paidAmount)}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-2">
                {isProfit ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    {t.reveal.profit}:
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    {t.reveal.loss}:
                  </>
                )}
              </span>
              <span
                className={`text-3xl font-bold ${
                  isProfit ? "text-green-400" : "text-red-400"
                }`}
              >
                {isProfit ? "+" : ""}
                {formatMon(Math.abs(difference))}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="flex-1 py-3 bg-monad-gradient hover:opacity-90 text-white font-semibold rounded-lg transition"
            >
              {t.reveal.addToCollection}
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
