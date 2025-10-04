import { Link } from "react-router-dom";
import { Trophy, TrendingDown, Heart } from "lucide-react";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";
import { formatMon } from "../lib/ev";

export function ProfilePage() {
  const { auctions, wonAuctions, currentUser, bids, settings } = useStore();
  const t = useTranslation(settings.language);

  const myBids = bids.filter((b) => b.bidder.id === currentUser.id);
  const myWonAuctions = auctions.filter((a) => wonAuctions.includes(a.id));

  const uniqueAuctionsBidOn = Array.from(
    new Set(myBids.map((b) => b.auctionId))
  ).map((id) => auctions.find((a) => a.id === id));

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.profile.title}</h1>
          <p className="text-gray-400">{currentUser.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{myWonAuctions.length}</div>
                <div className="text-sm text-gray-400">{t.profile.won}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {uniqueAuctionsBidOn.length - myWonAuctions.length}
                </div>
                <div className="text-sm text-gray-400">{t.profile.lost}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-monad/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-monad-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{myBids.length}</div>
                <div className="text-sm text-gray-400">Toplam Teklif</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{t.profile.won}</h2>
            {myWonAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myWonAuctions.map((auction) => (
                  <Link
                    key={auction.id}
                    to={`/reveal/${auction.id}`}
                    className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-monad/50 transition"
                  >
                    <img
                      src={auction.cover}
                      alt={auction.title}
                      className="w-full aspect-video object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-white font-bold mb-2">{auction.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Ödenen:</span>
                      <span className="text-monad-400 font-semibold">
                        {formatMon(auction.currentPriceMon)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Henüz kazanılan açık artırma yok</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{t.profile.myBids}</h2>
            {uniqueAuctionsBidOn.length > 0 ? (
              <div className="space-y-3">
                {uniqueAuctionsBidOn.map((auction) => {
                  if (!auction) return null;
                  const myBidsForAuction = myBids.filter(
                    (b) => b.auctionId === auction.id
                  );
                  const won = wonAuctions.includes(auction.id);

                  return (
                    <Link
                      key={auction.id}
                      to={won ? `/reveal/${auction.id}` : `/auction/${auction.id}`}
                      className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-monad/50 transition"
                    >
                      <img
                        src={auction.cover}
                        alt={auction.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-1">{auction.title}</h3>
                        <div className="text-sm text-gray-400">
                          {myBidsForAuction.length} teklif verildi
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          won
                            ? "bg-green-500/20 text-green-400"
                            : auction.status === "ended"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {won ? "Kazanıldı" : auction.status === "ended" ? "Kaybedildi" : "Canlı"}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Henüz teklif verilmedi</p>
                <Link
                  to="/"
                  className="inline-block mt-4 px-6 py-2 bg-monad-gradient text-white font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Açık Artırmalara Göz At
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
