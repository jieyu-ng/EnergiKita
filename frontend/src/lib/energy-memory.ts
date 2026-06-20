export type SavedBillSnapshot = {
  billingMonth: string;
  consumptionKwh: number;
  totalAmountRm?: number;
  billingDays?: number;
};

export type MonthlyInsightRecord = {
  billingMonth: string;
  billKwh: number;
  billingDays: number;
  averageDailyKwh: number;
  estimatedBillRm: number;
  expensiveTierUsage: number;
  kwhToNextCheaperTier: number;
  potentialSavingsTo300: number;
  benchmarkDeltaPercent: number;
  dominantDriver: string;
  recommendation: string;
  estimatedMonthlySavingsRm: number;
  baseEnergyScore: number;
  energyScore: number;
  scoreBreakdown: {
    usagePenalty: number;
    tariffPenalty: number;
    benchmarkPenalty: number;
    driverPenalty: number;
  };
  actionStatus?: "followed" | "not_followed" | "pending";
  actionCheckInAt?: string;
};

const LATEST_BILL_KEY = "ek_latest_bill";
const MONTHLY_HISTORY_KEY = "ek_monthly_history";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadLatestBill(): SavedBillSnapshot | null {
  if (typeof window === "undefined") return null;
  return safeParse<SavedBillSnapshot | null>(window.localStorage.getItem(LATEST_BILL_KEY), null);
}

export function saveLatestBill(snapshot: SavedBillSnapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LATEST_BILL_KEY, JSON.stringify(snapshot));
}

export function loadMonthlyHistory(): MonthlyInsightRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse<MonthlyInsightRecord[]>(window.localStorage.getItem(MONTHLY_HISTORY_KEY), []);
}

export function saveMonthlyInsight(record: MonthlyInsightRecord) {
  if (typeof window === "undefined") return;
  const existing = loadMonthlyHistory().filter((item) => item.billingMonth !== record.billingMonth);
  const updated = [record, ...existing].sort((a, b) => b.billingMonth.localeCompare(a.billingMonth));
  window.localStorage.setItem(MONTHLY_HISTORY_KEY, JSON.stringify(updated.slice(0, 12)));
}

export function updateMonthlyInsightAction(
  billingMonth: string,
  actionStatus: "followed" | "not_followed"
) {
  if (typeof window === "undefined") return;
  const updated = loadMonthlyHistory().map((item) =>
    item.billingMonth === billingMonth
      ? {
          ...item,
          actionStatus,
          energyScore:
            actionStatus === "followed"
              ? Math.min(100, item.baseEnergyScore + 5)
              : Math.max(20, item.baseEnergyScore - 3),
          actionCheckInAt: new Date().toISOString(),
        }
      : item
  );
  window.localStorage.setItem(MONTHLY_HISTORY_KEY, JSON.stringify(updated));
}
