import { CaseAuction } from "../types";

export class CompetitorSimulation {
  private endTs: number;
  private intervalId?: number;
  private onBid: (bidderId: string) => void;

  constructor(
    auction: CaseAuction,
    onBid: (bidderId: string) => void
  ) {
    this.endTs = auction.endTs;
    this.onBid = onBid;
  }

  start() {
    this.intervalId = window.setInterval(() => {
      const timeLeft = this.endTs - Date.now();
      const totalDuration = this.endTs - (this.endTs - 60000);
      const progress = 1 - timeLeft / totalDuration;

      const sigmoid = (x: number) => 1 / (1 + Math.exp(-10 * (x - 0.5)));
      const intensity = sigmoid(progress);

      const shouldBid = Math.random() < intensity * 0.3;

      if (shouldBid && timeLeft > 0) {
        const competitors = ["comp-1", "comp-2", "comp-3", "comp-4", "comp-5"];
        const randomCompetitor =
          competitors[Math.floor(Math.random() * competitors.length)];
        this.onBid(randomCompetitor);
      }

      if (timeLeft <= 0) {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  triggerBurst(count: number) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const competitors = ["comp-1", "comp-2", "comp-3", "comp-4", "comp-5"];
        const randomCompetitor =
          competitors[Math.floor(Math.random() * competitors.length)];
        this.onBid(randomCompetitor);
      }, i * 200);
    }
  }
}

export function calculateBidVelocity(
  bids: Array<{ ts: number }>,
  windowMs: number = 10000
): number {
  const now = Date.now();
  const recentBids = bids.filter((b) => now - b.ts < windowMs);
  return (recentBids.length / windowMs) * 1000;
}
