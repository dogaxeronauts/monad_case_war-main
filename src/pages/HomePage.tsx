import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Zap } from "lucide-react";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";
import { AuctionCard } from "../components/AuctionCard";
import { generateSeedAuctions } from "../data/seedAuctions";

export function HomePage() {
  const { auctions, bids, settings } = useStore();
  const t = useTranslation(settings.language);
  const seedsInitialized = useRef(false);

  useEffect(() => {
    if (auctions.length === 0 && !seedsInitialized.current) {
      seedsInitialized.current = true;
      const seedAuctions = generateSeedAuctions();
      useStore.setState(() => ({
        auctions: seedAuctions,
      }));
    }
  }, [auctions.length]);

  const liveAuctions = auctions.filter((a) => a.status === "live");

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div
        className="relative overflow-hidden bg-gradient-to-br from-monad-900 via-gray-900 to-gray-900"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-monad/20 border border-monad/30 rounded-full text-monad-300 text-sm mb-6">
            <Zap className="w-4 h-4" />
            {t.hero.poweredBy}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t.hero.title}
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="px-8 py-4 bg-monad-gradient hover:opacity-90 text-white font-semibold rounded-xl transition flex items-center gap-2 text-lg"
            >
              <Sparkles className="w-5 h-5" />
              {t.nav.create}
            </Link>
            <a
              href="#auctions"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl transition text-lg"
            >
              {t.auction.viewDetails}
            </a>
          </div>
        </div>
      </div>

      <div id="auctions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {t.auction.live} {t.nav.home}
            </h2>
            <p className="text-gray-400">
              {liveAuctions.length} aktif açık artırma
            </p>
          </div>
        </div>

        {liveAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                bids={bids}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Henüz açık artırma yok
            </h3>
            <p className="text-gray-500 mb-6">İlk kasayı sen oluştur!</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-monad-gradient text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              <Sparkles className="w-5 h-5" />
              {t.nav.create}
            </Link>
          </div>
        )}
      </div>

      <footer className="border-t border-white/10 bg-gray-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            {t.footer.disclaimer}
          </div>
          <div className="text-center mt-2">
            <Link
              to="/how-it-works"
              className="text-monad-400 hover:text-monad-300 text-sm transition"
            >
              {t.footer.responsiblePlay}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
