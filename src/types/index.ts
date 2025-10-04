export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface NftItem {
  id: string;
  name: string;
  image: string;
  rarity: Rarity;
  estValueMon: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isYou?: boolean;
}

export interface CaseAuction {
  id: string;
  title: string;
  cover: string;
  seller: User;
  items: NftItem[];
  summary: Record<Rarity, number>;
  minPriceMon: number;
  incrementMon: number;
  durationChoice: 5 | 15 | 30 | 60;
  startTs: number;
  endTs: number;
  currentPriceMon: number;
  highestBidderId?: string;
  status: "live" | "ended";
  evMon: { exact: number; rarityBaseline: number };
}

export interface Bid {
  id: string;
  auctionId: string;
  bidder: User;
  amountMon: number;
  ts: number;
}

export interface UiFlags {
  youAreLeading: boolean;
  showOutbidFallingBanner: boolean;
  highBidRate: boolean;
  lastOutbidTs?: number;
}

export type Language = "tr" | "en";

export interface Settings {
  language: Language;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}
