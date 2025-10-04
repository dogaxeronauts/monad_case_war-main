import { NftItem, Rarity } from "../types";

export const RARITY_BASELINE: Record<Rarity, number> = {
  common: 2,
  uncommon: 6,
  rare: 20,
  epic: 200,
  legendary: 20000,
};

export const RARITY_COLORS: Record<Rarity, string> = {
  common: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  uncommon: "text-teal-400 bg-teal-400/10 border-teal-400/20",
  rare: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  epic: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  legendary: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

export const RARITY_GLOW: Record<Rarity, string> = {
  common: "shadow-slate-400/20",
  uncommon: "shadow-teal-400/40",
  rare: "shadow-blue-400/40",
  epic: "shadow-purple-400/60",
  legendary: "shadow-amber-400/80",
};

export function calculateCaseSummary(
  items: NftItem[]
): Record<Rarity, number> {
  const summary: Record<Rarity, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };

  items.forEach((item) => {
    summary[item.rarity]++;
  });

  return summary;
}

export function calculateExactEV(items: NftItem[]): number {
  return items.reduce((sum, item) => sum + item.estValueMon, 0);
}

export function calculateRarityBaselineEV(
  summary: Record<Rarity, number>
): number {
  return Object.entries(summary).reduce((sum, [rarity, count]) => {
    return sum + count * RARITY_BASELINE[rarity as Rarity];
  }, 0);
}

export function formatMon(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M MON`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K MON`;
  }
  return `${amount} MON`;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}s ${minutes}dk`;
  }
  if (minutes > 0) {
    return `${minutes}dk ${seconds}s`;
  }
  return `${seconds}s`;
}
