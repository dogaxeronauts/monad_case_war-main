import { Rarity } from "../types";
import { RARITY_COLORS } from "../lib/ev";
import { useStore } from "../lib/store";
import { useTranslation } from "../lib/i18n";

interface RarityChipProps {
  rarity: Rarity;
  count?: number;
  size?: "sm" | "md";
}

export function RarityChip({ rarity, count, size = "sm" }: RarityChipProps) {
  const { settings } = useStore();
  const t = useTranslation(settings.language);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 ${RARITY_COLORS[rarity]} border rounded-full font-medium ${sizeClasses[size]}`}
    >
      {t.rarity[rarity]}
      {count !== undefined && count > 0 && (
        <span className="font-bold">×{count}</span>
      )}
    </span>
  );
}
