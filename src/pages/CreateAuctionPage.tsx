import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Loader2, ExternalLink, Wallet } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";
import { MOCK_NFTS } from "../data/mockNfts";
import { RarityChip } from "../components/RarityChip";
import { formatMon, calculateCaseSummary, calculateExactEV, calculateRarityBaselineEV } from "../lib/ev";
import { NftItem } from "../types";
import { monadDeployer } from "../lib/monadDeployer";

export function CreateAuctionPage() {
  const navigate = useNavigate();
  const { createAuction, settings } = useStore();
  const { authenticated, login } = usePrivy();
  const t = useTranslation(settings.language);

  const [selectedItems, setSelectedItems] = useState<NftItem[]>([]);
  const [minPrice, setMinPrice] = useState(50);
  const [duration, setDuration] = useState<5 | 15 | 30 | 60>(15);
  const [title, setTitle] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{
    success: boolean;
    vaultId?: number;
    transactionHash?: string;
    error?: string;
  } | null>(null);

  const toggleItem = (item: NftItem) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleCreate = async () => {
    if (selectedItems.length === 0 || !title.trim()) return;

    // Wallet bağlantısını kontrol et
    if (!authenticated) {
      alert('Demo modunda çalışıyor. Gerçek deployment için wallet bağlayın.');
      // Demo modunda devam et, wallet olmadan da çalışsın
    }

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      // Get player address from wallet or use default
      const playerAddress = authenticated ? await monadDeployer.getWalletAddress() : null;
      const treasuryAddress = import.meta.env.VITE_TREASURY_CONTRACT_ADDRESS || "0x1111111111111111111111111111111111111111";

      // Monad testnet'e contract deploy et
      const result = await monadDeployer.createVault({
        title: title.trim(),
        selectedNFTs: selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          rarity: item.rarity
        })),
        minPrice,
        duration,
        treasuryAddress,
        playerAddress: playerAddress || undefined
      });

      setDeploymentResult(result);

      if (result.success) {
        // Demo amaçlı normal auction oluşturmaya devam et
        const cover = selectedItems[0]?.image || MOCK_NFTS[0].image;
        const auctionId = createAuction(selectedItems, minPrice, duration, title, cover);
        
        // Log auction creation with blockchain details
        console.log('Auction created with blockchain integration:', {
          localAuctionId: auctionId,
          blockchainAuctionId: result.auctionId,
          vaultId: result.vaultId,
          transactionHash: result.transactionHash,
          treasuryAddress,
          playerAddress: playerAddress || 'demo-mode'
        });
        
        // Başarı bildirimi göster
        setTimeout(() => {
          navigate(`/auction/${auctionId}`);
        }, 3000);
      }
    } catch (error) {
      console.error('Contract deployment hatası:', error);
      setDeploymentResult({
        success: false,
        error: 'Contract deployment başarısız oldu'
      });
    } finally {
      setIsDeploying(false);
    }
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

              {/* Wallet Connection Info */}
              {!authenticated && (
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Demo modunda çalışıyor - Gerçek contract deployment için wallet bağlayın
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreate}
                disabled={selectedItems.length === 0 || !title.trim() || isDeploying}
                className="w-full py-4 bg-monad-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {authenticated ? 'Contract Deploy Ediliyor...' : 'Demo Kasa Oluşturuluyor...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {authenticated ? 'Monad\'da Kasa Oluştur' : 'Demo Kasa Oluştur'}
                  </>
                )}
              </button>

              {/* Deployment Result */}
              {deploymentResult && (
                <div className={`mt-4 p-4 rounded-lg border ${
                  deploymentResult.success 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {deploymentResult.success ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-semibold">
                          {authenticated ? 'Kasa başarıyla deploy edildi!' : 'Demo kasa başarıyla oluşturuldu!'}
                        </span>
                      </div>
                      {deploymentResult.vaultId && (
                        <div className="text-sm">
                          Vault ID: #{deploymentResult.vaultId}
                        </div>
                      )}
                      {deploymentResult.transactionHash && (
                        <div className="text-sm">
                          <a 
                            href={`https://explorer.testnet.monad.xyz/tx/${deploymentResult.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {authenticated ? 'Transaction: ' : 'Mock TX: '}{deploymentResult.transactionHash.slice(0, 10)}...
                          </a>
                        </div>
                      )}
                      <div className="text-sm">
                        Demo auction'a yönlendiriliyorsunuz...
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold">Contract deployment başarısız</div>
                      <div className="text-sm mt-1">{deploymentResult.error}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
