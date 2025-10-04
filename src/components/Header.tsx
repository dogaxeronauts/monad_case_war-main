import { Link } from "react-router-dom";
import { Settings, Zap, LogIn, LogOut, User } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";

export function Header() {
  const { settings, updateSettings } = useStore();
  const t = useTranslation(settings.language);
  const { ready, authenticated, user, login, logout } = usePrivy();

  const toggleLanguage = () => {
    updateSettings({ language: settings.language === "tr" ? "en" : "tr" });
  };

  const formatAddress = (address: string) => {
    return `${address}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-monad-gradient rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">
                {t.appName}
              </div>
              <div className="text-xs text-gray-400">{t.demo}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition">
              {t.nav.home}
            </Link>
            <Link
              to="/create"
              className="text-gray-300 hover:text-white transition"
            >
              {t.nav.create}
            </Link>
            <Link
              to="/profile"
              className="text-gray-300 hover:text-white transition"
            >
              {t.nav.profile}
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-300 hover:text-white transition"
            >
              {t.nav.howItWorks}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 transition"
            >
              {settings.language.toUpperCase()}
            </button>
            
            {/* Privy Auth Section */}
            {ready && (
              <>
                {authenticated && user ? (
                  <div className="flex items-center gap-3">
                    {/* User Address Display */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                      <User className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-300">
                        {user.wallet?.address ? formatAddress(user.wallet.address) : 
                         user.email?.address ? user.email.address : 'User'}
                      </span>
                    </div>
                    {/* Logout Button */}
                    <button
                      onClick={logout}
                      className="p-2 hover:bg-white/10 rounded-lg transition text-gray-300"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  /* Login Button */
                  <button
                    onClick={login}
                    className="flex items-center gap-2 px-4 py-2 bg-monad-gradient hover:opacity-90 rounded-lg text-white transition font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                )}
              </>
            )}
            
            <Link
              to="/settings"
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Settings className="w-5 h-5 text-gray-300" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
