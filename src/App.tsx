import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { AuctionPage } from "./pages/AuctionPage";
import { CreateAuctionPage } from "./pages/CreateAuctionPage";
import { RevealPage } from "./pages/RevealPage";
import { ProfilePage } from "./pages/ProfilePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auction/:id" element={<AuctionPage />} />
          <Route path="/create" element={<CreateAuctionPage />} />
          <Route path="/reveal/:id" element={<RevealPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
