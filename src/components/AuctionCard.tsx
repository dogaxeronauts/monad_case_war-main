import { Link } from "react-router-dom";
import { Clock, TrendingUp, Flame } from "lucide-react";
import { CaseAuction, Bid } from "../types";
import { RarityChip } from "./RarityChip";
import { formatMon, formatTime } from "../lib/ev";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";
import { calculateBidVelocity } from "../lib/simulation";
import { useState, useEffect } from "react";

interface AuctionCardProps {
  auction: CaseAuction;
  bids: Bid[];
}

export function AuctionCard({ auction, bids }: AuctionCardProps) {
  const { settings } = useStore();
  const t = useTranslation(settings.language);
  const [timeLeft, setTimeLeft] = useState(auction.endTs - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(auction.endTs - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [auction.endTs]);

  const auctionBids = bids.filter((b) => b.auctionId === auction.id);
  const bidVelocity = calculateBidVelocity(auctionBids);
  const isHot = bidVelocity > 0.5;

  const rarityEntries = Object.entries(auction.summary)
    .filter(([, count]) => count > 0)
    .slice(0, 3);

  return (
    <Link
      to={`/auction/${auction.id}`}
      className="group relative bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-monad/50 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={auction.cover}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        {auction.status === "live" && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            {t.auction.live}
          </div>
        )}

        {isHot && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500/90 text-white text-xs font-bold rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {bidVelocity.toFixed(1)}/s
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-monad-400 transition">
          {auction.title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {rarityEntries.map(([rarity, count]) => (
            <RarityChip
              key={rarity}
              rarity={rarity as any}
              count={count}
              size="sm"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div>
            <div className="text-gray-400 text-xs mb-0.5">
              {t.auction.minPrice}
            </div>
            <div className="text-white font-semibold">
              {formatMon(auction.minPriceMon)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {t.auction.ev}
            </div>
            <div className="text-monad-400 font-semibold">
              {formatMon(auction.evMon.exact)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Clock className="w-4 h-4" />
            {timeLeft > 0 ? formatTime(timeLeft) : t.auction.ended}
          </div>
          <div className="text-xl font-bold text-white">
            {formatMon(auction.currentPriceMon)}
          </div>
        </div>

        <button className="w-full mt-3 py-2.5 bg-monad-gradient hover:opacity-90 text-white font-semibold rounded-lg transition">
          {t.auction.viewDetails}
        </button>
      </div>
    </Link>
  );
}
