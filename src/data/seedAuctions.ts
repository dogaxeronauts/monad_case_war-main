import { CaseAuction } from "../types";
import { MOCK_NFTS } from "./mockNfts";
import { calculateCaseSummary, calculateExactEV, calculateRarityBaselineEV } from "../lib/ev";

export function generateSeedAuctions(): CaseAuction[] {
  const now = Date.now();

  const auction1Items = [
    MOCK_NFTS[0],
    MOCK_NFTS[6],
    MOCK_NFTS[7],
    MOCK_NFTS[16],
    MOCK_NFTS[17],
    MOCK_NFTS[18],
    MOCK_NFTS[19],
    MOCK_NFTS[20],
  ];

  const auction2Items = [
    MOCK_NFTS[3],
    MOCK_NFTS[8],
    MOCK_NFTS[9],
    MOCK_NFTS[10],
    MOCK_NFTS[21],
    MOCK_NFTS[22],
    MOCK_NFTS[23],
    MOCK_NFTS[24],
    MOCK_NFTS[25],
    MOCK_NFTS[35],
    MOCK_NFTS[36],
    MOCK_NFTS[37],
  ];

  const auction3Items = [
    MOCK_NFTS[1],
    MOCK_NFTS[29],
    MOCK_NFTS[28],
    MOCK_NFTS[30],
    MOCK_NFTS[39],
    MOCK_NFTS[4],
    MOCK_NFTS[5],
  ];

  const auction1Summary = calculateCaseSummary(auction1Items);
  const auction2Summary = calculateCaseSummary(auction2Items);
  const auction3Summary = calculateCaseSummary(auction3Items);

  return [
    {
      id: "seed-auction-1",
      title: "Cosmic Legends Pack",
      cover: "https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=800",
      seller: {
        id: "seller-1",
        name: "Ayşe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayse",
      },
      items: auction1Items,
      summary: auction1Summary,
      minPriceMon: 120,
      incrementMon: 1,
      durationChoice: 15,
      startTs: now - 5 * 60 * 1000,
      endTs: now + 10 * 60 * 1000,
      currentPriceMon: 145,
      highestBidderId: "comp-2",
      status: "live",
      evMon: {
        exact: calculateExactEV(auction1Items),
        rarityBaseline: calculateRarityBaselineEV(auction1Summary),
      },
    },
    {
      id: "seed-auction-2",
      title: "Starter Collection",
      cover: "https://images.pexels.com/photos/1089440/pexels-photo-1089440.jpeg?auto=compress&cs=tinysrgb&w=800",
      seller: {
        id: "seller-2",
        name: "Mehmet",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mehmet",
      },
      items: auction2Items,
      summary: auction2Summary,
      minPriceMon: 60,
      incrementMon: 1,
      durationChoice: 5,
      startTs: now - 2 * 60 * 1000,
      endTs: now + 3 * 60 * 1000,
      currentPriceMon: 78,
      highestBidderId: "comp-4",
      status: "live",
      evMon: {
        exact: calculateExactEV(auction2Items),
        rarityBaseline: calculateRarityBaselineEV(auction2Summary),
      },
    },
    {
      id: "seed-auction-3",
      title: "Ultimate Vault",
      cover: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=800",
      seller: {
        id: "seller-3",
        name: "Zeynep",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zeynep",
      },
      items: auction3Items,
      summary: auction3Summary,
      minPriceMon: 500,
      incrementMon: 1,
      durationChoice: 30,
      startTs: now - 10 * 60 * 1000,
      endTs: now + 20 * 60 * 1000,
      currentPriceMon: 582,
      highestBidderId: "comp-1",
      status: "live",
      evMon: {
        exact: calculateExactEV(auction3Items),
        rarityBaseline: calculateRarityBaselineEV(auction3Summary),
      },
    },
  ];
}
