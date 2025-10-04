import { Zap, TrendingUp, Shield, Sparkles } from "lucide-react";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";

export function HowItWorksPage() {
  const { settings } = useStore();
  const t = useTranslation(settings.language);

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">{t.howItWorks.title}</h1>
          <p className="text-xl text-gray-400">{t.howItWorks.demoNotice}</p>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-monad-gradient rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t.howItWorks.auctionFlow}</h2>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-monad/20 rounded-full flex items-center justify-center text-monad-400 font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Kasa Oluştur</h3>
                  <p className="text-gray-400">
                    NFT'leri seç, minimum fiyatı belirle ve süreyi ayarla. Kasanız oluşturulduğunda
                    otomatik olarak açık artırma başlar.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-monad/20 rounded-full flex items-center justify-center text-monad-400 font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Teklif Ver</h3>
                  <p className="text-gray-400">
                    Her tıklamada +1 MON teklif ver. Hızlı tıklamalarla Monad'ın 10,000 TPS gücünü
                    hisset. Otomatik teklif özelliğini de kullanabilirsin.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-monad/20 rounded-full flex items-center justify-center text-monad-400 font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Kazan ve Aç</h3>
                  <p className="text-gray-400">
                    Süre bittiğinde en yüksek teklifi veren kazanır. Kazandıysan kasayı aç ve
                    NFT'leri gör!
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-monad-gradient rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t.howItWorks.evExplanation}</h2>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <p className="text-gray-400 mb-4">
                Her kasa için iki farklı EV (Beklenen Değer) hesaplama yöntemi kullanılır:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Exact EV (Gerçek Değer)</h3>
                  <p className="text-gray-400 text-sm">
                    Kasadaki tüm NFT'lerin tahmin edilen MON değerlerinin toplamı. Bu, kasanın
                    gerçek içeriğine dayalı kesin değerdir.
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Rarity Baseline EV</h3>
                  <p className="text-gray-400 text-sm">
                    Her nadirlik seviyesi için belirlenen ortalama değerlere göre hesaplanan tahmini
                    değer. Common: 2 MON, Uncommon: 6 MON, Rare: 20 MON, Epic: 200 MON, Legendary:
                    20,000 MON.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-monad-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Monad & 10,000 TPS</h2>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <p className="text-gray-400 mb-4">
                Bu demo, Monad blockchain'inin saniyede 10,000 işlem (TPS) kapasitesini simüle eder.
                Hızlı tıklamalar ve anlık teklif güncellemeleri, gerçek zamanlı blockchain
                işlemlerinin nasıl hissettireceğini gösterir.
              </p>
              <div className="bg-monad/10 border border-monad/30 rounded-lg p-4">
                <p className="text-monad-300 text-sm">
                  <strong>Not:</strong> Bu bir demo uygulamasıdır. Gerçek blockchain işlemleri
                  yapılmaz ve gerçek para/NFT transferi olmaz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-monad-gradient rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t.howItWorks.responsiblePlay}</h2>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-monad-400 mt-1">•</span>
                  <span>
                    Bu tamamen bir demo uygulamasıdır. Gerçek para, kripto para veya NFT
                    transferleri yapılmaz.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-monad-400 mt-1">•</span>
                  <span>
                    Tüm veriler tarayıcınızda yerel olarak saklanır. Sunucu tarafında veri
                    depolanmaz.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-monad-400 mt-1">•</span>
                  <span>
                    "MON" değerleri ve açık artırmalar sadece deneyimi göstermek için simüle
                    edilmiştir.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-monad-400 mt-1">•</span>
                  <span>
                    Herhangi bir zamanda "Ayarlar" menüsünden demo'yu sıfırlayabilirsiniz.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
