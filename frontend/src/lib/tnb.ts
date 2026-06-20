export type HouseholdProfile = {
  billKwh: number;
  billingDays: number;
  occupantCount: number;
  propertyType: string;
  acCount: number;
  acTemperature: number;
  acFilterCleaning: string;
  fridgeCount: number;
  fridgeAge: string;
  heaterHours: number;
  lightingType: string;
  cookingType: string;
};

type TariffBlock = {
  upto: number;
  rate: number;
};

const TNB_DOMESTIC_BLOCKS: TariffBlock[] = [
  { upto: 200, rate: 0.218 },
  { upto: 300, rate: 0.334 },
  { upto: 600, rate: 0.516 },
  { upto: 900, rate: 0.546 },
  { upto: Number.POSITIVE_INFINITY, rate: 0.571 },
];

const BENCHMARKS: Record<string, number> = {
  condo: 380,
  terrace: 520,
  "semi-d": 650,
  bungalow: 780,
};

function round(value: number, digits = 1) {
  return Number(value.toFixed(digits));
}

function calculateTariffCost(kwh: number) {
  let remaining = kwh;
  let previousLimit = 0;
  let cost = 0;

  for (const block of TNB_DOMESTIC_BLOCKS) {
    if (remaining <= 0) break;
    const blockSize = block.upto - previousLimit;
    const usageInBlock = Math.min(remaining, blockSize);
    cost += usageInBlock * block.rate;
    remaining -= usageInBlock;
    previousLimit = block.upto;
  }

  return cost;
}

function classifyUsage(kwh: number) {
  if (kwh < 300) return "low-to-medium";
  if (kwh <= 600) return "medium";
  return "heavy";
}

export function buildEnergyDiagnosis(profile: HouseholdProfile) {
  const averageDailyKwh = profile.billKwh / Math.max(profile.billingDays, 1);
  const benchmark = BENCHMARKS[profile.propertyType] ?? 450;
  const adjustedBenchmark = benchmark + Math.max(profile.occupantCount - 3, 0) * 35;
  const benchmarkDeltaPercent = ((profile.billKwh - adjustedBenchmark) / adjustedBenchmark) * 100;
  const currentCost = calculateTariffCost(profile.billKwh);
  const costAt300 = calculateTariffCost(Math.min(profile.billKwh, 300));
  const expensiveTierUsage = Math.max(profile.billKwh - 300, 0);
  const kwhToNextCheaperTier = expensiveTierUsage;
  const potentialSavingsTo300 = currentCost - costAt300;

  let score = 0;
  score += profile.acCount * 18;
  if (profile.acTemperature <= 20) score += 18;
  else if (profile.acTemperature <= 22) score += 12;
  else if (profile.acTemperature <= 24) score += 6;
  if (profile.acFilterCleaning === "rarely") score += 10;
  else if (profile.acFilterCleaning === "sometimes") score += 5;
  score += profile.heaterHours * 8;
  score += profile.fridgeCount * 6;
  if (profile.fridgeAge === "old") score += 10;
  else if (profile.fridgeAge === "mid") score += 5;
  if (profile.lightingType === "non-led") score += 8;
  else if (profile.lightingType === "mixed") score += 4;
  if (profile.cookingType === "induction") score += 5;
  if (profile.cookingType === "mixed") score += 3;

  const dominantDriver =
    score >= 55
      ? "air conditioning"
      : profile.heaterHours >= 2.5
        ? "water heating"
        : profile.fridgeAge === "old"
          ? "older refrigeration"
          : "combined cooling and appliance load";

  const usagePenalty = Math.min(profile.billKwh / 12, 35);
  const tariffPenalty = Math.min(expensiveTierUsage / 8, 20);
  const benchmarkPenalty = Math.max(benchmarkDeltaPercent, 0) * 0.25;
  const driverPenalty = Math.min(score * 0.18, 18);
  const energyScore = Math.max(
    20,
    Math.min(95, round(100 - usagePenalty - tariffPenalty - benchmarkPenalty - driverPenalty, 0))
  );

  return {
    usageBand: classifyUsage(profile.billKwh),
    averageDailyKwh: round(averageDailyKwh),
    estimatedBillRm: round(currentCost, 2),
    expensiveTierUsage: round(expensiveTierUsage),
    kwhToNextCheaperTier: round(kwhToNextCheaperTier),
    potentialSavingsTo300: round(Math.max(potentialSavingsTo300, 0), 2),
    benchmarkKwh: round(adjustedBenchmark),
    benchmarkDeltaPercent: round(benchmarkDeltaPercent),
    dominantDriver,
    driverScore: round(score, 0),
    energyScore,
    scoreBreakdown: {
      usagePenalty: round(usagePenalty, 1),
      tariffPenalty: round(tariffPenalty, 1),
      benchmarkPenalty: round(benchmarkPenalty, 1),
      driverPenalty: round(driverPenalty, 1),
    },
  };
}
