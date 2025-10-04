import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";
import { MOCK_NFTS } from "../data/mockNfts";
import { RarityChip } from "../components/RarityChip";
import { formatMon, calculateCaseSummary, calculateExactEV, calculateRarityBaselineEV } from "../lib/ev";
import { NftItem } from "../types";

export function CreateAuctionPage() {
  const navigate = useNavigate();
  const { createAuction, settings } = useStore();
  const t = useTranslation(settings.language);

  const [selectedItems, setSelectedItems] = useState<NftItem[]>([]);
  const [minPrice, setMinPrice] = useState(50);
  const [duration, setDuration] = useState<5 | 15 | 30 | 60>(15);
  const [title, setTitle] = useState("");

  const toggleItem = (item: NftItem) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleCreate = () => {
    if (selectedItems.length === 0 || !title.trim()) return;

    const cover = selectedItems[0]?.image || MOCK_NFTS[0].image;
    const auctionId = createAuction(selectedItems, minPrice, duration, title, cover);
    navigate(`/auction/${auctionId}`);
  };

  const summary = calculateCaseSummary(selectedItems);
  const exactEV = calculateExactEV(selectedItems);
  const rarityBaselineEV = calculateRarityBaselineEV(summary);

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.create.title}</h1>
          <p className="text-gray-400">NFT'leri seç ve minimum fiyatı belirle</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">{t.create.selectNfts}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MOCK_NFTS.map((item) => {
                  const isSelected = selectedItems.find((i) => i.id === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      className={`relative bg-gray-900/50 rounded-lg p-3 transition border-2 ${
                        isSelected
                          ? "border-monad shadow-lg shadow-monad/50"
                          : "border-transparent hover:border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-monad rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full aspect-square object-cover rounded mb-2"
                      />
                      <div className="text-sm text-white font-medium truncate mb-1">{item.name}</div>
                      <div className="flex items-center justify-between gap-2">
                        <RarityChip rarity={item.rarity} size="sm" />
                        <span className="text-xs text-monad-400 font-semibold">
                          {formatMon(item.estValueMon)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-24 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">{t.create.caseSummary}</h2>
                <div className="text-sm text-gray-400 mb-2">
                  {selectedItems.length} {t.create.selected}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(summary)
                    .filter(([, count]) => count > 0)
                    .map(([rarity, count]) => (
                      <RarityChip key={rarity} rarity={rarity as any} count={count} size="md" />
                    ))}
                </div>

                {selectedItems.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Exact EV:</span>
                      <span className="text-monad-400 font-semibold">{formatMon(exactEV)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Baseline EV:</span>
                      <span className="text-monad-400 font-semibold">{formatMon(rarityBaselineEV)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kasa Başlığı</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Epik Koleksiyon"
                  className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-monad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.create.minPrice}
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-monad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {t.create.duration}
                </label>
                <div className="space-y-2">
                  {([5, 15, 30, 60] as const).map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setDuration(dur)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                        duration === dur
                          ? "bg-monad border-monad text-white"
                          : "bg-gray-900 border-white/10 text-gray-300 hover:border-monad/50"
                      }`}
                    >
                      {t.create.durations[dur]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={selectedItems.length === 0 || !title.trim()}
                className="w-full py-4 bg-monad-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {t.create.createButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
