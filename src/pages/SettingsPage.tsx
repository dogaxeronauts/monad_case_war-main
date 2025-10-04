import { useNavigate } from "react-router-dom";
import { RotateCcw, Volume2, VolumeX, Vibrate, Eye, Contrast } from "lucide-react";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, resetDemo } = useStore();
  const t = useTranslation(settings.language);

  const handleReset = () => {
    if (confirm("Tüm demo verileri silinecek. Emin misiniz?")) {
      resetDemo();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">{t.settings.title}</h1>

        <div className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <div className="text-white font-medium">{t.settings.sound}</div>
                  <div className="text-sm text-gray-400">Teklif ve bildirim sesleri</div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`relative w-12 h-6 rounded-full transition ${
                  settings.soundEnabled ? "bg-monad" : "bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.soundEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-white font-medium">{t.settings.haptics}</div>
                  <div className="text-sm text-gray-400">Titreşim geri bildirimi</div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
                className={`relative w-12 h-6 rounded-full transition ${
                  settings.hapticsEnabled ? "bg-monad" : "bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.hapticsEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-white font-medium">{t.settings.reducedMotion}</div>
                  <div className="text-sm text-gray-400">Animasyonları azalt</div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                className={`relative w-12 h-6 rounded-full transition ${
                  settings.reducedMotion ? "bg-monad" : "bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.reducedMotion ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Contrast className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-white font-medium">{t.settings.highContrast}</div>
                  <div className="text-sm text-gray-400">Yüksek kontrast modu</div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                className={`relative w-12 h-6 rounded-full transition ${
                  settings.highContrast ? "bg-monad" : "bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.highContrast ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleReset}
              className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-400 font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {t.settings.resetDemo}
            </button>
            <p className="text-center text-gray-500 text-sm mt-3">
              Tüm açık artırmalar, teklifler ve ayarlar silinecek
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
