import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CaseAuction,
  Bid,
  User,
  Settings,
  UiFlags,
  NftItem,
} from "../types";
import { calculateCaseSummary, calculateExactEV, calculateRarityBaselineEV } from "./ev";

interface StoreState {
  currentUser: User;
  auctions: CaseAuction[];
  bids: Bid[];
  settings: Settings;
  uiFlags: Record<string, UiFlags>;
  wonAuctions: string[];

  createAuction: (
    items: NftItem[],
    minPrice: number,
    duration: 5 | 15 | 30 | 60,
    title: string,
    cover: string
  ) => string;
  placeBid: (auctionId: string, bidderId?: string) => void;
  finalizeAuction: (auctionId: string) => void;
  updateUiFlag: (auctionId: string, flags: Partial<UiFlags>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetDemo: () => void;
  addWonAuction: (auctionId: string) => void;
}

const CURRENT_USER: User = {
  id: "you",
  name: "Sen",
  isYou: true,
};

const initialSettings: Settings = {
  language: "tr",
  soundEnabled: false,
  hapticsEnabled: true,
  reducedMotion: false,
  highContrast: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentUser: CURRENT_USER,
      auctions: [],
      bids: [],
      settings: initialSettings,
      uiFlags: {},
      wonAuctions: [],

      createAuction: (items, minPrice, duration, title, cover) => {
        const auctionId = `auction-${Date.now()}`;
        const summary = calculateCaseSummary(items);
        const exactEV = calculateExactEV(items);
        const rarityBaselineEV = calculateRarityBaselineEV(summary);
        const startTs = Date.now();
        const endTs = startTs + duration * 60 * 1000;

        const newAuction: CaseAuction = {
          id: auctionId,
          title,
          cover,
          seller: get().currentUser,
          items,
          summary,
          minPriceMon: minPrice,
          incrementMon: 1,
          durationChoice: duration,
          startTs,
          endTs,
          currentPriceMon: minPrice,
          status: "live",
          evMon: { exact: exactEV, rarityBaseline: rarityBaselineEV },
        };

        set((state) => ({
          auctions: [...state.auctions, newAuction],
        }));

        return auctionId;
      },

      placeBid: (auctionId, bidderId) => {
        const state = get();
        const auction = state.auctions.find((a) => a.id === auctionId);
        if (!auction || auction.status !== "live") return;

        const bidder = bidderId
          ? {
              id: bidderId,
              name: bidderId === "you" ? "Sen" : `User ${bidderId.slice(-4)}`,
              isYou: bidderId === "you",
            }
          : state.currentUser;

        const newPrice = auction.currentPriceMon + auction.incrementMon;

        const newBid: Bid = {
          id: `bid-${Date.now()}-${Math.random()}`,
          auctionId,
          bidder,
          amountMon: newPrice,
          ts: Date.now(),
        };

        const wasLeading = auction.highestBidderId === state.currentUser.id;
        const isNowLeading = bidder.id === state.currentUser.id;

        set((prevState) => ({
          auctions: prevState.auctions.map((a) =>
            a.id === auctionId
              ? {
                  ...a,
                  currentPriceMon: newPrice,
                  highestBidderId: bidder.id,
                }
              : a
          ),
          bids: [...prevState.bids, newBid],
        }));

        if (wasLeading && !isNowLeading) {
          get().updateUiFlag(auctionId, {
            youAreLeading: false,
            showOutbidFallingBanner: true,
            lastOutbidTs: Date.now(),
          });
        } else if (isNowLeading) {
          get().updateUiFlag(auctionId, {
            youAreLeading: true,
            showOutbidFallingBanner: false,
          });
        }
      },

      finalizeAuction: (auctionId) => {
        set((state) => ({
          auctions: state.auctions.map((a) =>
            a.id === auctionId ? { ...a, status: "ended" } : a
          ),
        }));
      },

      updateUiFlag: (auctionId, flags) => {
        set((state) => ({
          uiFlags: {
            ...state.uiFlags,
            [auctionId]: {
              ...state.uiFlags[auctionId],
              ...flags,
            },
          },
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      addWonAuction: (auctionId) => {
        set((state) => ({
          wonAuctions: [...state.wonAuctions, auctionId],
        }));
      },

      resetDemo: () => {
        set({
          auctions: [],
          bids: [],
          uiFlags: {},
          wonAuctions: [],
          settings: initialSettings,
        });
      },
    }),
    {
      name: "monad-auction-store",
    }
  )
);
