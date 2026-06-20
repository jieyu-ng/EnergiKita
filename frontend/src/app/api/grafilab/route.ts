import { NextResponse } from "next/server";
import { buildEnergyDiagnosis, type HouseholdProfile } from "@/lib/tnb";

const MODEL_ID = "grafilab/qwen3-vl-flash";

export async function POST(request: Request) {
  const apiKey = process.env.GRAFILAB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GRAFILAB_API_KEY in frontend/.env.local." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as HouseholdProfile;
  const diagnosis = buildEnergyDiagnosis(body);

  const prompt = `
You are an energy analysis assistant for a Malaysian household energy platform.
Given the household profile below, return only valid JSON with this exact schema:
{
  "summary": string,
  "recommendation": string,
  "estimatedBillSharePercent": number,
  "peakPeriod": string,
  "estimatedMonthlySavingsRm": number,
  "confidence": number,
  "financialDiagnosis": string,
  "benchmarkInsight": string,
  "rootCause": string,
  "tariffInsight": string,
  "diagnosis": {
    "averageDailyKwh": number,
    "estimatedBillRm": number,
    "expensiveTierUsage": number,
    "kwhToNextCheaperTier": number,
    "potentialSavingsTo300": number,
    "benchmarkKwh": number,
    "benchmarkDeltaPercent": number,
    "trendDeltaPercent": number,
    "dominantDriver": string,
    "energyScore": number,
    "scoreBreakdown": {
      "usagePenalty": number,
      "tariffPenalty": number,
      "benchmarkPenalty": number,
      "driverPenalty": number
    }
  }
}

You are not a generic chatbot.
Explain the deterministic calculations below in a practical, motivating way.
Anchor the advice to Malaysian household behavior and TNB bill logic.

Structured inputs:
- Total kWh: ${body.billKwh}
- Billing days: ${body.billingDays}
- Occupants: ${body.occupantCount}
- Property type: ${body.propertyType}
- AC units: ${body.acCount}
- AC temperature: ${body.acTemperature}C
- AC filter cleaning: ${body.acFilterCleaning}
- Refrigerators: ${body.fridgeCount}
- Fridge age: ${body.fridgeAge}
- Water heater hours/day: ${body.heaterHours}
- Lighting type: ${body.lightingType}
- Cooking type: ${body.cookingType}
- Previous bill kWh: ${body.previousBillKwh ?? "none"}
- Recent average kWh: ${body.recentAverageKwh ?? "none"}
- Last action follow-through: ${body.lastActionStatus ?? "none"}

Deterministic diagnosis from the platform:
- Usage band: ${diagnosis.usageBand}
- Average daily usage: ${diagnosis.averageDailyKwh} kWh/day
- Estimated tariff cost: RM ${diagnosis.estimatedBillRm}
- Usage above 300 kWh tariff threshold: ${diagnosis.expensiveTierUsage} kWh
- kWh needed to return to cheaper tier: ${diagnosis.kwhToNextCheaperTier} kWh
- Estimated savings if user gets back to 300 kWh: RM ${diagnosis.potentialSavingsTo300}
- Benchmark for similar home: ${diagnosis.benchmarkKwh} kWh
- Benchmark delta: ${diagnosis.benchmarkDeltaPercent}%
- Bill trend versus previous month: ${diagnosis.trendDeltaPercent}%
- Likely dominant driver: ${diagnosis.dominantDriver}
- Driver score: ${diagnosis.driverScore}
- Platform energy score: ${diagnosis.energyScore}/100

Rules:
- summary should explain the user's current bill situation in 2 sentences.
- recommendation should be the single best next action.
- estimatedBillSharePercent should estimate how much of the bill is driven by the dominant behavior.
- peakPeriod should be a short label like "Evening 7pm-11pm".
- estimatedMonthlySavingsRm should be realistic and grounded in the diagnosis.
- financialDiagnosis should mention total kWh, billing days, and daily average.
- benchmarkInsight should compare the household against similar homes.
- rootCause should clearly say what is likely driving the bill.
- tariffInsight should mention the 300 kWh threshold and why it matters.
- Use recent bill history when present so the recommendation feels adaptive instead of generic.
- Prefer no-cost or low-cost first actions before recommending purchases.
- diagnosis must mirror the deterministic platform values exactly with no changes.
- Keep it practical and concise.
- Confidence must be between 0 and 1.
Do not include markdown fences or extra text.
`.trim();

  const response = await fetch("https://console-api.grafilab.ai/api/oai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_ID,
      messages: [
        {
          role: "system",
          content: "Return strict JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: `Grafilab request failed: ${errorText}` },
      { status: 502 }
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    return NextResponse.json(
      { error: "Grafilab returned an empty response." },
      { status: 502 }
    );
  }

  try {
    const parsed = JSON.parse(content);
    return NextResponse.json({
      ...parsed,
      diagnosis: {
        averageDailyKwh: diagnosis.averageDailyKwh,
        estimatedBillRm: diagnosis.estimatedBillRm,
        expensiveTierUsage: diagnosis.expensiveTierUsage,
        kwhToNextCheaperTier: diagnosis.kwhToNextCheaperTier,
        potentialSavingsTo300: diagnosis.potentialSavingsTo300,
        benchmarkKwh: diagnosis.benchmarkKwh,
        benchmarkDeltaPercent: diagnosis.benchmarkDeltaPercent,
        trendDeltaPercent: diagnosis.trendDeltaPercent,
        dominantDriver: diagnosis.dominantDriver,
        energyScore: diagnosis.energyScore,
        scoreBreakdown: diagnosis.scoreBreakdown,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Grafilab returned invalid JSON." },
      { status: 502 }
    );
  }
}
