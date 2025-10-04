import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Crown, Zap, Users, TrendingUp } from "lucide-react";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";
import { LivePriceTicker } from "../components/LivePriceTicker";
import { PlusOneRain } from "../components/PlusOneRain";
import { OutbidBanner } from "../components/OutbidBanner";
import { CountdownTimer } from "../components/CountdownTimer";
import { RarityChip } from "../components/RarityChip";
import { formatMon } from "../lib/ev";
import { CompetitorSimulation, calculateBidVelocity } from "../lib/simulation";

export function AuctionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auctions, bids, currentUser, placeBid, finalizeAuction, settings, updateUiFlag, uiFlags, addWonAuction } = useStore();
  const t = useTranslation(settings.language);

  const auction = auctions.find((a) => a.id === id);
  const auctionBids = bids.filter((b) => b.auctionId === id);
  const uiFlag = uiFlags[id || ""] || {
    youAreLeading: false,
    showOutbidFallingBanner: false,
    highBidRate: false,
  };

  const [autoBid, setAutoBid] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const simulationRef = useRef<CompetitorSimulation | null>(null);
  const autoBidIntervalRef = useRef<number>();

  const bidVelocity = calculateBidVelocity(auctionBids);
  const isHighBidRate = bidVelocity > 0.8;

  useEffect(() => {
    updateUiFlag(id || "", { highBidRate: isHighBidRate });
  }, [isHighBidRate, id, updateUiFlag]);

  useEffect(() => {
    if (!auction) return;

    const simulation = new CompetitorSimulation(auction, (bidderId) => {
      placeBid(auction.id, bidderId);
    });

    simulation.start();
    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [auction?.id]);

  useEffect(() => {
    if (autoBid && auction?.status === "live") {
      autoBidIntervalRef.current = window.setInterval(() => {
        handleBid();
      }, 1000);
    } else {
      if (autoBidIntervalRef.current) {
        clearInterval(autoBidIntervalRef.current);
      }
    }

    return () => {
      if (autoBidIntervalRef.current) {
        clearInterval(autoBidIntervalRef.current);
      }
    };
  }, [autoBid, auction?.status]);

  const handleBid = useCallback(() => {
    if (!auction || auction.status !== "live") return;
    placeBid(auction.id, "you");

    if (settings.hapticsEnabled && navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, [auction, placeBid, settings.hapticsEnabled]);

  const handleAuctionEnd = useCallback(() => {
    if (!auction) return;
    finalizeAuction(auction.id);

    if (auction.highestBidderId === currentUser.id) {
      addWonAuction(auction.id);
      setTimeout(() => {
        navigate(`/reveal/${auction.id}`);
      }, 1000);
    }
  }, [auction, finalizeAuction, currentUser.id, navigate, addWonAuction]);

  const handleDismissOutbid = useCallback(() => {
    updateUiFlag(id || "", { showOutbidFallingBanner: false });
  }, [id, updateUiFlag]);

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Açık artırma bulunamadı</h2>
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

  const youAreLead = auction.highestBidderId === currentUser.id;
  const topBidders = auctionBids
    .reduce((acc: any[], bid) => {
      const existing = acc.find((b) => b.bidder.id === bid.bidder.id);
      if (existing) {
        existing.amount = Math.max(existing.amount, bid.amountMon);
        existing.count++;
      } else {
        acc.push({ bidder: bid.bidder, amount: bid.amountMon, count: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <OutbidBanner show={uiFlag.showOutbidFallingBanner} onDismiss={handleDismissOutbid} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-24">
              <img
                src={auction.cover}
                alt={auction.title}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <h1 className="text-2xl font-bold text-white mb-2">{auction.title}</h1>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <span>Satıcı:</span>
                <span className="text-white">{auction.seller.name}</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(auction.summary)
                    .filter(([, count]) => count > 0)
                    .map(([rarity, count]) => (
                      <RarityChip key={rarity} rarity={rarity as any} count={count} size="md" />
                    ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t.auction.minPrice}:</span>
                  <span className="text-white font-semibold">{formatMon(auction.minPriceMon)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {t.auction.ev}:
                  </span>
                  <span className="text-monad-400 font-semibold">{formatMon(auction.evMon.exact)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowItems(!showItems)}
                className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition"
              >
                {showItems ? "Gizle" : t.auction.caseItems}
              </button>

              {showItems && (
                <div className="mt-4 grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {auction.items.map((item) => (
                    <div key={item.id} className="bg-gray-900/50 rounded-lg p-2">
                      <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded mb-2" />
                      <div className="text-xs text-white font-medium truncate">{item.name}</div>
                      <RarityChip rarity={item.rarity} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 relative overflow-hidden">
              <PlusOneRain active={uiFlag.highBidRate} intensity={bidVelocity} />

              <div className="relative z-10 space-y-6">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-2">{t.auction.currentPrice}</div>
                  <LivePriceTicker price={auction.currentPriceMon} />
                </div>

                <div className="flex justify-center">
                  <CountdownTimer endTs={auction.endTs} onEnd={handleAuctionEnd} />
                </div>

                {youAreLead && auction.status === "live" && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-monad-gradient rounded-xl text-white font-bold animate-pulse-glow"
                  >
                    <Crown className="w-5 h-5" />
                    {t.auction.youAreLead}
                  </div>
                )}

                {auction.status === "live" ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleBid}
                      className="flex-1 py-4 bg-monad-gradient hover:opacity-90 text-white font-bold text-xl rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-6 h-6" />
                      {t.auction.bidNow}
                    </button>
                    <button
                      onClick={() => setAutoBid(!autoBid)}
                      className={`px-6 py-4 border-2 rounded-xl font-semibold transition ${
                        autoBid
                          ? "bg-monad border-monad text-white"
                          : "border-white/20 text-gray-300 hover:border-monad/50"
                      }`}
                    >
                      {t.auction.autoBid}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-2xl font-bold text-red-500 mb-4">{t.auction.ended}</div>
                    {auction.highestBidderId === currentUser.id ? (
                      <div className="text-xl text-monad-400 font-semibold">{t.auction.winner}</div>
                    ) : (
                      <div className="text-xl text-gray-400">{t.auction.lost}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-white">{t.auction.topBidders}</h3>
              </div>

              <div className="space-y-2">
                {topBidders.map((bidder, index) => (
                  <div
                    key={bidder.bidder.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      bidder.bidder.isYou ? "bg-monad/20 border border-monad/30" : "bg-gray-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">
                        {bidder.bidder.isYou ? "Sen" : bidder.bidder.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{formatMon(bidder.amount)}</div>
                      <div className="text-xs text-gray-400">{bidder.count} teklif</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Canlı Teklif Akışı</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {auctionBids
                  .slice()
                  .reverse()
                  .slice(0, 20)
                  .map((bid) => (
                    <div
                      key={bid.id}
                      className={`flex items-center justify-between p-2 rounded ${
                        bid.bidder.isYou ? "bg-monad/10" : "bg-gray-900/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-700 rounded-full" />
                        <span className="text-sm text-white">
                          {bid.bidder.isYou ? "Sen" : bid.bidder.name}
                        </span>
                      </div>
                      <div className="text-sm text-monad-400 font-semibold">+1</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
