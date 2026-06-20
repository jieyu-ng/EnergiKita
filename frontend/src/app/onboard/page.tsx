"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, CheckCircle2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { loadLatestBill, saveMonthlyInsight } from "@/lib/energy-memory";

type AnalysisResult = {
  summary: string;
  recommendation: string;
  estimatedBillSharePercent: number;
  peakPeriod: string;
  estimatedMonthlySavingsRm: number;
  confidence: number;
  financialDiagnosis: string;
  benchmarkInsight: string;
  rootCause: string;
  tariffInsight: string;
  diagnosis: {
    averageDailyKwh: number;
    estimatedBillRm: number;
    expensiveTierUsage: number;
    kwhToNextCheaperTier: number;
    potentialSavingsTo300: number;
    benchmarkDeltaPercent: number;
    dominantDriver: string;
    energyScore: number;
    scoreBreakdown: {
      usagePenalty: number;
      tariffPenalty: number;
      benchmarkPenalty: number;
      driverPenalty: number;
    };
  };
};

export default function OnboardPage() {
  const router = useRouter();
  const { accountType } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qStep, setQStep] = useState(1);
  const [billKwh, setBillKwh] = useState(474);
  const [billingDays, setBillingDays] = useState(31);
  const [occupantCount, setOccupantCount] = useState(4);
  const [propertyType, setPropertyType] = useState("condo");
  const [acCount, setAcCount] = useState(2);
  const [acTemperature, setAcTemperature] = useState(20);
  const [acFilterCleaning, setAcFilterCleaning] = useState("sometimes");
  const [fridgeCount, setFridgeCount] = useState(1);
  const [fridgeAge, setFridgeAge] = useState("mid");
  const [heaterHours, setHeaterHours] = useState(2);
  const [lightingType, setLightingType] = useState("mostly-led");
  const [cookingType, setCookingType] = useState("induction");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    const latestBill = loadLatestBill();
    if (!latestBill) return;
    setBillKwh(latestBill.consumptionKwh);
    if (latestBill.billingDays) {
      setBillingDays(latestBill.billingDays);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisError("");
    setIsSubmitting(true);

    if (accountType === "business") {
      setTimeout(() => {
        router.push("/passport");
      }, 1500);
      return;
    }

    void fetch("/api/grafilab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        billKwh,
        billingDays,
        occupantCount,
        propertyType,
        acCount,
        acTemperature,
        acFilterCleaning,
        fridgeCount,
        fridgeAge,
        heaterHours,
        lightingType,
        cookingType,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to process data right now.");
        }
        setAnalysisResult(data);
        const billingMonth = loadLatestBill()?.billingMonth ?? `2026-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
        saveMonthlyInsight({
          billingMonth,
          billKwh,
          billingDays,
          averageDailyKwh: data.diagnosis.averageDailyKwh,
          estimatedBillRm: data.diagnosis.estimatedBillRm,
          expensiveTierUsage: data.diagnosis.expensiveTierUsage,
          kwhToNextCheaperTier: data.diagnosis.kwhToNextCheaperTier,
          potentialSavingsTo300: data.diagnosis.potentialSavingsTo300,
          benchmarkDeltaPercent: data.diagnosis.benchmarkDeltaPercent,
          dominantDriver: data.diagnosis.dominantDriver,
          recommendation: data.recommendation,
          estimatedMonthlySavingsRm: data.estimatedMonthlySavingsRm,
          baseEnergyScore: data.diagnosis.energyScore,
          energyScore: data.diagnosis.energyScore,
          scoreBreakdown: data.diagnosis.scoreBreakdown,
          actionStatus: "pending",
        });
        setQStep(2);
      })
      .catch((error: Error) => {
        setAnalysisError(error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col items-center pt-16 pb-32 px-6">
      <div className="max-w-[var(--content-width)] w-full max-w-2xl space-y-8">
        {accountType === "business" && (
          <div className="bg-[var(--color-paper-2)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[var(--text-base)] font-bold text-[var(--color-ink)] flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
                Equipment Pattern Review
              </h2>
              <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-ink-2)] bg-[var(--color-paper-3)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                Confidence: 0.71
              </span>
            </div>

            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
              <p className="text-[var(--text-sm)] text-[var(--color-ink)] font-medium mb-3">
                Probable contributor: <span className="text-[var(--color-accent)]">Air conditioning / continuous refrigeration</span>
              </p>
              <div className="space-y-2">
                <p className="text-[var(--text-xs)] font-bold text-[var(--color-ink-3)] uppercase tracking-wider">Evidence Trail</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start text-[var(--text-sm)] text-[var(--color-ink-2)]">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                    Long operating hours inferred from base load.
                  </li>
                  <li className="flex items-start text-[var(--text-sm)] text-[var(--color-ink-2)]">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                    High daytime load assumption matches commercial cooling profile.
                  </li>
                  <li className="flex items-start text-[var(--text-sm)] text-[var(--color-ink-2)]">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                    Usage spike (+18.6%) compared with previous month correlates with recent temperature increases.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {accountType === "business" ? (
          <>
            <div className="space-y-2 pt-4">
              <h1 className="text-[var(--text-3xl)] font-bold text-[var(--color-ink)] tracking-tight">
                Business Energy Context
              </h1>
              <p className="text-[var(--text-base)] text-[var(--color-ink-2)]">
                Review the detected load pattern and add operating constraints so EnergiKita can prepare a usable business energy passport.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm p-8 space-y-8 relative">
                {isSubmitting && (
                  <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center rounded-[var(--radius-lg)]">
                    <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                      Preparing your business energy recommendations...
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-border)]">Operating Constraints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Primary Equipment</label>
                      <input type="text" defaultValue="Air Conditioning & Dryers" className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Flexible Equipment</label>
                      <input type="text" defaultValue="Washing cycles (1-2 hour delay ok)" className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button type="button" onClick={() => router.back()} className="text-[var(--text-sm)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] font-medium transition-colors px-4 py-2">
                  Back
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm disabled:opacity-50 transition-colors">
                  Continue to Energy Passport
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-6 pt-4">
            {qStep === 1 ? (
              <>
                <div className="space-y-2">
                  <h1 className="text-[var(--text-3xl)] font-bold text-[var(--color-ink)] tracking-tight">
                    Household Energy Diagnosis
                  </h1>
                  <p className="text-[var(--text-base)] text-[var(--color-ink-2)]">
                    Combine your TNB bill data and lifestyle profile so EnergiKita can diagnose what is driving your bill.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm p-8 space-y-8 relative">
                  {isSubmitting && (
                    <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center rounded-[var(--radius-lg)]">
                      <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-success)] rounded-full animate-spin mb-4"></div>
                      <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                        Diagnosing your TNB bill and household profile...
                      </p>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-border)]">
                        Bill Data Inputs
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Total kWh Consumption</label>
                          <input type="number" min="0" value={billKwh} onChange={(e) => setBillKwh(Number(e.target.value))} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Billing Days</label>
                          <input type="number" min="1" value={billingDays} onChange={(e) => setBillingDays(Number(e.target.value))} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-border)]">
                        Household Metadata
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Property Type</label>
                          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all">
                            <option value="condo">Condo / Apartment</option>
                            <option value="terrace">Terrace House</option>
                            <option value="semi-d">Semi-D</option>
                            <option value="bungalow">Bungalow</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Number of Occupants</label>
                          <input type="number" min="1" value={occupantCount} onChange={(e) => setOccupantCount(Number(e.target.value))} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-border)]">
                        Lifestyle Inputs
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Air Conditioners Running Daily</label>
                          <input type="number" min="0" value={acCount} onChange={(e) => setAcCount(Number(e.target.value))} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Typical AC Temperature</label>
                          <input type="number" min="16" max="30" value={acTemperature} onChange={(e) => setAcTemperature(Number(e.target.value))} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">AC Filter Cleaning Habit</label>
                          <select value={acFilterCleaning} onChange={(e) => setAcFilterCleaning(e.target.value)} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all">
                            <option value="regular">Regularly</option>
                            <option value="sometimes">Sometimes</option>
                            <option value="rarely">Rarely</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Refrigerators</label>
                          <input type="number" min="0" value={fridgeCount} onChange={(e) => setFridgeCount(Number(e.target.value))} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Refrigerator Age</label>
                          <select value={fridgeAge} onChange={(e) => setFridgeAge(e.target.value)} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all">
                            <option value="new">Newer than 5 years</option>
                            <option value="mid">5 to 10 years</option>
                            <option value="old">Older than 10 years</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Water Heater Usage (hours/day)</label>
                          <input type="number" min="0" step="0.5" value={heaterHours} onChange={(e) => setHeaterHours(Number(e.target.value))} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Lighting Type</label>
                          <select value={lightingType} onChange={(e) => setLightingType(e.target.value)} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all">
                            <option value="mostly-led">Mostly LED</option>
                            <option value="mixed">Mixed Lighting</option>
                            <option value="non-led">Mostly Non-LED</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Primary Cooking Method</label>
                          <select value={cookingType} onChange={(e) => setCookingType(e.target.value)} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all">
                            <option value="induction">Induction / Electric Stove</option>
                            <option value="gas">Gas Stove</option>
                            <option value="mixed">Mixed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--color-border)] flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="bg-[var(--color-success)] hover:bg-[#059669] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm disabled:opacity-50 transition-colors">
                      Generate Energy Advice
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-[var(--text-3xl)] font-bold text-[var(--color-ink)] tracking-tight">
                    Your Energy Diagnosis
                  </h1>
                  <p className="text-[var(--text-base)] text-[var(--color-ink-2)]">
                    This result combines tariff math, household benchmarking, and bill-linked explanation tailored to your home.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Financial Diagnosis</p>
                    <p className="mt-2 text-[var(--text-sm)] text-[var(--color-ink-2)]">{analysisResult?.financialDiagnosis}</p>
                  </div>
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Tariff Insight</p>
                    <p className="mt-2 text-[var(--text-sm)] text-[var(--color-ink-2)]">{analysisResult?.tariffInsight}</p>
                    <div className="mt-3 rounded-[var(--radius-md)] bg-[var(--color-paper-2)] p-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Cheaper Tier Gap</p>
                      <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">
                        {analysisResult?.diagnosis.kwhToNextCheaperTier} kWh away
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Benchmark Insight</p>
                    <p className="mt-2 text-[var(--text-sm)] text-[var(--color-ink-2)]">{analysisResult?.benchmarkInsight}</p>
                  </div>
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Likely Root Cause</p>
                    <p className="mt-2 text-[var(--text-sm)] text-[var(--color-ink-2)]">{analysisResult?.rootCause}</p>
                  </div>
                </div>

                <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-success)] shadow-sm p-6 space-y-4">
                  <div className="flex items-start">
                    <Cpu className="w-6 h-6 text-[var(--color-success)] mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-[var(--text-base)] text-[var(--color-ink)]">Best Next Action</h3>
                      <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-2 leading-relaxed">
                        {analysisResult?.summary}
                      </p>
                      <div className="mt-4 p-4 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[var(--radius-md)]">
                        <p className="text-[var(--text-sm)] font-medium text-[#065f46]">
                          Advice: {analysisResult?.recommendation}
                        </p>
                      </div>
                      {analysisResult && (
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-3">
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Bill Share</p>
                            <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">{analysisResult.estimatedBillSharePercent}%</p>
                          </div>
                          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-3">
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Peak Period</p>
                            <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">{analysisResult.peakPeriod}</p>
                          </div>
                          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-3">
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Savings</p>
                            <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">RM {analysisResult.estimatedMonthlySavingsRm}/mo</p>
                          </div>
                          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-3 sm:col-span-3">
                            <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Personal Energy Score</p>
                            <p className="mt-1 text-[var(--text-xl)] font-bold text-[var(--color-ink)]">
                              {analysisResult.diagnosis.energyScore}/100
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button onClick={() => router.push("/passport")} className="bg-[var(--color-success)] hover:bg-[#059669] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm transition-colors">
                    Generate Home Energy Passport
                  </button>
                </div>
              </div>
            )}
            {analysisError && (
              <div className="rounded-[var(--radius-md)] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[var(--text-sm)] text-[#991b1b]">
                {analysisError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
