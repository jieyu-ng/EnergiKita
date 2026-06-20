"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Check, FileJson, CalendarDays, Banknote, Gauge, Clock3 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  loadMonthlyHistory,
  saveLatestBill,
  type MonthlyInsightRecord,
  updateMonthlyInsightAction,
} from "@/lib/energy-memory";
import {
  getSourceReliabilitySummary,
  saveExtractionTelemetry,
  type ExtractionFieldName,
} from "@/lib/extraction-telemetry";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function buildEssentialSavingsAction(record: MonthlyInsightRecord) {
  const driver = record.dominantDriver.toLowerCase();

  if (driver.includes("air")) {
    return {
      title: "Raise AC settings before buying anything",
      summary: "Try 24C first, pair it with a fan, and clean filters before making a hardware purchase.",
      cost: "No-cost first step",
    };
  }

  if (driver.includes("water")) {
    return {
      title: "Trim water-heater time",
      summary: "Shorter heater use is usually the fastest zero-cost move when hot water is driving the bill.",
      cost: "No-cost first step",
    };
  }

  if (driver.includes("refriger")) {
    return {
      title: "Tune fridge efficiency first",
      summary: "Check temperature settings and airflow around the fridge before replacing the appliance.",
      cost: "Low-cost first step",
    };
  }

  return {
    title: "Start with one no-cost routine change",
    summary: "Shift the highest-usage daily habit first before considering any paid upgrade.",
    cost: "No-cost first step",
  };
}

function buildRecommendationReasons(record: MonthlyInsightRecord) {
  return [
    `You are ${record.kwhToNextCheaperTier} kWh away from the cheaper 300 kWh tariff threshold.`,
    `Your home is ${Math.abs(record.benchmarkDeltaPercent)}% ${record.benchmarkDeltaPercent > 0 ? "above" : "below"} similar households on current usage.`,
    `${record.dominantDriver} looks like the strongest bill driver right now.`,
  ];
}

export default function Home() {
  const router = useRouter();
  const { accountType } = useUser();
  const [step, setStep] = useState(1);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [originalExtractedData, setOriginalExtractedData] = useState<any>(null);
  const [history, setHistory] = useState<MonthlyInsightRecord[]>([]);
  const [sourceReliabilityMessage, setSourceReliabilityMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(loadMonthlyHistory());
  }, []);

  useEffect(() => {
    if (extractedData?.source) {
      buildReliabilityMessage(extractedData.source);
    } else {
      setSourceReliabilityMessage("");
    }
  }, [extractedData?.source]);

  const refreshHistory = () => {
    setHistory(loadMonthlyHistory());
  };

  const saveBillSnapshot = (data: {
    billing_month?: string;
    consumption_kwh?: number;
    total_amount_rm?: number;
    billing_days?: number;
  }) => {
    saveLatestBill({
      billingMonth: data.billing_month ?? "2026-05",
      consumptionKwh: data.consumption_kwh ?? 0,
      totalAmountRm: data.total_amount_rm,
      billingDays: data.billing_days,
    });
  };

  const setExtractionPayload = (data: any) => {
    setExtractedData(data);
    setOriginalExtractedData(data);
    saveBillSnapshot(data);
  };

  const handleExtractedFieldChange = (
    field: "billing_month" | "consumption_kwh" | "total_amount_rm" | "billing_days",
    value: string
  ) => {
    setExtractedData((current: any) => {
      if (!current) return current;
      const next = {
        ...current,
        [field]:
          field === "billing_month"
            ? value
            : value === ""
              ? null
              : Number(value),
      };
      saveBillSnapshot(next);
      return next;
    });
  };

  const hasFieldChanged = (field: "billing_month" | "consumption_kwh" | "total_amount_rm" | "billing_days") => {
    if (!originalExtractedData || !extractedData) return false;
    return originalExtractedData[field] !== extractedData[field];
  };

  const buildReliabilityMessage = (source: string) => {
    const summary = getSourceReliabilitySummary(source);
    if (!summary || summary.totalRecords < 2 || summary.correctionRate < 0.4) {
      setSourceReliabilityMessage("");
      return;
    }

    const fieldLabels: Record<ExtractionFieldName, string> = {
      billing_month: "billing month",
      consumption_kwh: "consumption kWh",
      total_amount_rm: "total amount",
      billing_days: "billing days",
    };

    const topFields = summary.topCorrectedFields.map((field) => fieldLabels[field]).join(" and ");
    setSourceReliabilityMessage(
      `${source === "pdf_extracted" ? "PDF bills" : "This extraction source"} often need manual confirmation for ${topFields}.`
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStep(2);

    if (file.type === "application/json" || file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setTimeout(() => {
            setExtractionPayload({
              ...json,
              source: json.source ?? "json_upload",
              extraction_notes: json.extraction_notes ?? ["We loaded these bill fields directly from your structured bill file."],
            });
            setStep(3);
          }, 1000);
        } catch (error) {
          console.error("Invalid JSON file");
          runMockExtraction();
        }
      };
      reader.readAsText(file);
    } else {
      const formData = new FormData();
      formData.append("file", file);
      void fetch("/api/bill-extract", {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Unable to extract this bill file.");
          }
          setExtractionPayload(data);
          setStep(3);
        })
        .catch((error: Error) => {
          console.error(error.message);
          runMockExtraction(error.message);
        });
    }
  };

  const loadSampleFixture = () => {
    setStep(2);
    void fetch("/sample-bills/tnb-household-sample.json")
      .then(async (response) => {
        const data = await response.json();
        setExtractionPayload(data);
        setStep(3);
      })
      .catch(() => {
        runMockExtraction("Unable to load the bundled sample bill.");
      });
  };

  const runMockExtraction = (fallbackReason?: string) => {
    setStep(2);
    setTimeout(() => {
      if (accountType === "business") {
        setExtractionPayload({
          billing_month: "May 2026",
          consumption_kwh: 1420,
          total_amount_rm: 980.00,
          billing_days: 31,
          confidence: 0.94,
          source: fallbackReason ? "fallback_mock" : "pdf_extracted",
          extraction_notes: fallbackReason
            ? [`We could not fully extract this bill, so we prepared estimated review values: ${fallbackReason}`]
            : ["We prepared business review values so you can continue the workflow while testing the platform."],
        });
      } else {
        setExtractionPayload({
          billing_month: "May 2026",
          consumption_kwh: 620,
          total_amount_rm: 320.00,
          billing_days: 31,
          confidence: 0.96,
          source: fallbackReason ? "fallback_mock" : "pdf_extracted",
          extraction_notes: fallbackReason
            ? [`We could not fully extract this bill, so we prepared estimated review values: ${fallbackReason}`]
            : ["We prepared household review values so you can continue the workflow while testing the platform."],
        });
      }
      setStep(3);
    }, 1500);
  };

  const latestRecord = history[0];
  const previousRecord = history[1];
  const progressDelta = latestRecord && previousRecord ? latestRecord.billKwh - previousRecord.billKwh : null;
  const scoreDelta = latestRecord && previousRecord ? latestRecord.energyScore - previousRecord.energyScore : null;
  const extractionSourceLabel =
    extractedData?.source === "pdf_extracted"
      ? "PDF Extracted"
      : extractedData?.source === "image_extracted"
        ? "Image Extracted"
        : extractedData?.source === "sample_json_fixture"
          ? "Sample Fixture"
            : extractedData?.source === "json_upload"
              ? "JSON Upload"
            : extractedData?.source === "fallback_mock"
              ? "Estimated Review"
              : "Structured Output";
  const confidencePercent = typeof extractedData?.confidence === "number"
    ? `${Math.round(extractedData.confidence * 100)}%`
    : null;
  const missingFields = extractedData
    ? [
        !extractedData.billing_month ? "Billing month" : null,
        extractedData.consumption_kwh === undefined || extractedData.consumption_kwh === null ? "Consumption (kWh)" : null,
        extractedData.total_amount_rm === undefined || extractedData.total_amount_rm === null ? "Total amount (RM)" : null,
        extractedData.billing_days === undefined || extractedData.billing_days === null ? "Billing days" : null,
      ].filter(Boolean) as string[]
    : [];
  const isLowConfidence = typeof extractedData?.confidence === "number" && extractedData.confidence < 0.8;
  const shouldVerifyBeforeContinue = missingFields.length > 0 || isLowConfidence || extractedData?.source === "fallback_mock";
  const changedFields = extractedData
    ? (["billing_month", "consumption_kwh", "total_amount_rm", "billing_days"] as const).filter((field) =>
        hasFieldChanged(field)
      )
    : [];
  const activeSourceSummary = extractedData?.source ? getSourceReliabilitySummary(extractedData.source) : null;
  const requiresSourceSpecificConfirmation =
    !!activeSourceSummary &&
    activeSourceSummary.totalRecords >= 2 &&
    activeSourceSummary.correctionRate >= 0.5;
  const flaggedFields = requiresSourceSpecificConfirmation
    ? activeSourceSummary.topCorrectedFields.map((field) => fieldLabels[field])
    : [];
  const blockedByReliability = requiresSourceSpecificConfirmation && changedFields.length === 0;
  const trendData = history
    .slice(0, 3)
    .reverse()
    .map((record) => ({
      month: record.billingMonth.slice(5).replace("-", "/"),
      kwh: record.billKwh,
      savings: record.estimatedMonthlySavingsRm,
      score: record.energyScore,
    }));
  const fieldLabels: Record<ExtractionFieldName, string> = {
    billing_month: "billing month",
    consumption_kwh: "consumption kWh",
    total_amount_rm: "total amount",
    billing_days: "billing days",
  };
  const monthlySavingsAtRisk = latestRecord
    ? Math.max(latestRecord.potentialSavingsTo300, latestRecord.estimatedMonthlySavingsRm)
    : null;
  const essentialSavingsAction = latestRecord ? buildEssentialSavingsAction(latestRecord) : null;
  const recommendationReasons = latestRecord ? buildRecommendationReasons(latestRecord) : [];

  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-32 px-6">
      <div className="max-w-[var(--content-width)] w-full text-center space-y-8">
        
        <h1 className="text-[var(--text-4xl)] md:text-5xl lg:text-6xl font-bold text-[var(--color-ink)] leading-tight tracking-tight max-w-3xl mx-auto">
          {accountType === "business" 
            ? "Energy flexibility infrastructure for modern businesses." 
            : "Energy flexibility infrastructure for modern households."}
        </h1>
        
        <p className="text-[var(--text-lg)] text-[var(--color-ink-2)] max-w-2xl mx-auto font-body">
          Extract bill data, diagnose tariff exposure, and turn monthly electricity usage into clear savings actions you can actually track.
        </p>

        {accountType === "individual" && latestRecord && (
          <div className="max-w-5xl mx-auto space-y-4 text-left pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Monthly Progress</p>
                <p className="mt-2 text-[var(--text-lg)] font-bold text-[var(--color-ink)]">
                  {progressDelta === null ? `${latestRecord.billKwh} kWh logged` : `${progressDelta > 0 ? "+" : ""}${progressDelta} kWh vs last bill`}
                </p>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--color-ink-2)] leading-relaxed">
                  {progressDelta !== null && progressDelta <= 0
                    ? "Your household is trending in the right direction."
                    : "Your next bill upload will show whether your recent changes are working."}
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Monthly Savings At Risk</p>
                <p className="mt-2 text-[var(--text-lg)] font-bold text-[var(--color-ink)]">
                  RM {monthlySavingsAtRisk}/mo
                </p>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--color-ink-2)] leading-relaxed">
                  You are {latestRecord.kwhToNextCheaperTier} kWh away from the cheaper domestic tier, so a small reduction can save faster.
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Essential Savings Mode</p>
                <p className="mt-2 text-[var(--text-lg)] font-bold text-[var(--color-ink)]">
                  {essentialSavingsAction?.title}
                </p>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--color-ink-2)] leading-relaxed">{essentialSavingsAction?.summary}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-[var(--color-success)]">{essentialSavingsAction?.cost}</p>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Energy Score</p>
                <p className="mt-2 text-[var(--text-lg)] font-bold text-[var(--color-ink)]">
                  {latestRecord.energyScore}/100
                </p>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--color-ink-2)] leading-relaxed">
                  {scoreDelta === null
                    ? "This is your first saved score."
                    : `${scoreDelta > 0 ? "+" : ""}${scoreDelta} vs last bill, including action follow-through.`}
                </p>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Why This Recommendation</p>
              <p className="mt-1 text-[var(--text-sm)] text-[var(--color-ink-2)]">
                EnergiKita is prioritising this action because it gives the highest savings-to-effort ratio for your current bill.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                {recommendationReasons.map((reason) => (
                  <div key={reason} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-4">
                    <p className="text-[var(--text-sm)] text-[var(--color-ink)]">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div>
                {trendData.length >= 2 ? (
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">3-Month Trend</p>
                        <p className="mt-1 text-[var(--text-sm)] text-[var(--color-ink-2)]">
                          Watch whether your bill and savings potential are moving in the right direction.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                          <XAxis dataKey="month" tickLine={false} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} width={36} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="kwh"
                            stroke="var(--color-accent)"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="var(--color-success)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Progress Tracking</p>
                    <p className="mt-2 text-[var(--text-sm)] text-[var(--color-ink-2)]">
                      Upload one more monthly bill to unlock a clearer savings trend and show whether your latest action is working.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Action Check-In</p>
                  <p className="mt-2 text-[var(--text-sm)] text-[var(--color-ink-2)]">
                    Did you follow your saved action before this month ended?
                  </p>
                  <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-paper-2)] p-4">
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">{latestRecord.recommendation}</p>
                    <p className="mt-2 text-[var(--text-xs)] text-[var(--color-ink-3)]">
                      Status:{" "}
                      {latestRecord.actionStatus === "followed"
                        ? "Followed"
                        : latestRecord.actionStatus === "not_followed"
                          ? "Not followed yet"
                          : "Waiting for check-in"}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => {
                        updateMonthlyInsightAction(latestRecord.billingMonth, "followed");
                        refreshHistory();
                      }}
                      className="flex-1 rounded-[var(--radius-md)] bg-[var(--color-success)] px-4 py-2 text-[var(--text-sm)] font-medium text-white transition-colors hover:bg-[#059669]"
                    >
                      Yes, I did
                    </button>
                    <button
                      onClick={() => {
                        updateMonthlyInsightAction(latestRecord.billingMonth, "not_followed");
                        refreshHistory();
                      }}
                      className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-2 text-[var(--text-sm)] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-2)]"
                    >
                      Not yet
                    </button>
                  </div>
                  <p className="mt-3 text-[var(--text-xs)] text-[var(--color-ink-3)]">
                    This helps EnergiKita learn which advice actually turns into savings for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-16 max-w-2xl mx-auto text-left">
          {step === 1 && (
            <>
              <div 
                onClick={() => runMockExtraction()}
                className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-12 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-accent)] transition-colors shadow-sm"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept=".json,.pdf,.png,.jpg"
                />
                <div className="w-12 h-12 rounded-full bg-[var(--color-paper-3)] flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6 text-[var(--color-ink-2)]" />
                </div>
                <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Upload an electricity bill to begin analysis</p>
                <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] mt-1">Supports structured JSON, bill images, and PDF uploads</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center">
                <button onClick={() => fileInputRef.current?.click()} className="text-[var(--text-xs)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] underline transition-colors">
                  Choose a bill file
                </button>
                <button onClick={loadSampleFixture} className="text-[var(--text-xs)] text-[var(--color-accent)] hover:text-[var(--color-ink)] underline transition-colors">
                  Try sample bill
                </button>
                <a href="/sample-bills/tnb-household-sample.pdf" target="_blank" rel="noreferrer" className="text-[var(--text-xs)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] underline transition-colors">
                  View sample PDF
                </a>
                <a href="/sample-bills/tnb-household-sample.svg" target="_blank" rel="noreferrer" className="text-[var(--text-xs)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] underline transition-colors">
                  View sample image
                </a>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-16 bg-white flex flex-col items-center justify-center shadow-sm">
              <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
              <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                Reading bill details and preparing review fields...
              </p>
            </div>
          )}

          {step === 3 && extractedData && (
            <div className="space-y-6">
              <div className={`rounded-[var(--radius-lg)] border shadow-sm overflow-hidden ${
                shouldVerifyBeforeContinue ? "border-[#fdba74] bg-[#fff7ed]" : "border-[#86efac] bg-[#f0fdf4]"
              }`}>
                <div className="px-6 py-4 border-b border-current/10 flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--text-sm)] text-[var(--color-ink)]">Extraction Quality Check</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    shouldVerifyBeforeContinue ? "bg-[#ffedd5] text-[#9a3412]" : "bg-[#dcfce7] text-[#166534]"
                  }`}>
                    {shouldVerifyBeforeContinue ? "Review Required" : "Ready To Continue"}
                  </span>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-[var(--radius-md)] bg-white/70 p-3 border border-current/10">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Missing Fields</p>
                      <p className="mt-1 text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                        {missingFields.length === 0 ? "None" : missingFields.join(", ")}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-white/70 p-3 border border-current/10">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Confidence</p>
                      <p className="mt-1 text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                        {confidencePercent ?? "Not provided"}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-white/70 p-3 border border-current/10">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Verification</p>
                      <p className="mt-1 text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                        {shouldVerifyBeforeContinue ? "Please verify this bill before continuing." : "This extraction is ready for diagnosis."}
                      </p>
                    </div>
                  </div>
                  {sourceReliabilityMessage && (
                    <div className="rounded-[var(--radius-md)] border border-[#fcd34d] bg-[#fffbeb] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-[#92400e]">Source Reliability Note</p>
                      <p className="mt-2 text-[var(--text-xs)] text-[#92400e]">{sourceReliabilityMessage}</p>
                    </div>
                  )}
                  {requiresSourceSpecificConfirmation && (
                    <div className="rounded-[var(--radius-md)] border border-[#fca5a5] bg-[#fff1f2] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-[#9f1239]">Confirmation Required</p>
                      <p className="mt-2 text-[var(--text-xs)] text-[#9f1239]">
                        This upload source has a higher correction rate. Please actively review or correct {flaggedFields.join(" and ")} before continuing.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                    <label className="text-[var(--text-xs)] text-[var(--color-ink-2)]">
                      Billing month
                      <input
                        type="text"
                        value={extractedData?.billing_month ?? ""}
                        onChange={(e) => handleExtractedFieldChange("billing_month", e.target.value)}
                        className={`mt-1 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] ${
                          hasFieldChanged("billing_month") ? "border-[var(--color-accent)] bg-[var(--color-paper-2)]" : "border-[var(--color-border)]"
                        }`}
                      />
                      {hasFieldChanged("billing_month") && (
                        <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)]">
                          Edited from original extraction
                        </span>
                      )}
                    </label>
                    <label className="text-[var(--text-xs)] text-[var(--color-ink-2)]">
                      Consumption (kWh)
                      <input
                        type="number"
                        value={extractedData?.consumption_kwh ?? ""}
                        onChange={(e) => handleExtractedFieldChange("consumption_kwh", e.target.value)}
                        className={`mt-1 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] ${
                          hasFieldChanged("consumption_kwh") ? "border-[var(--color-accent)] bg-[var(--color-paper-2)]" : "border-[var(--color-border)]"
                        }`}
                      />
                      {hasFieldChanged("consumption_kwh") && (
                        <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)]">
                          Edited from original extraction
                        </span>
                      )}
                    </label>
                    <label className="text-[var(--text-xs)] text-[var(--color-ink-2)]">
                      Total amount (RM)
                      <input
                        type="number"
                        step="0.01"
                        value={extractedData?.total_amount_rm ?? ""}
                        onChange={(e) => handleExtractedFieldChange("total_amount_rm", e.target.value)}
                        className={`mt-1 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] ${
                          hasFieldChanged("total_amount_rm") ? "border-[var(--color-accent)] bg-[var(--color-paper-2)]" : "border-[var(--color-border)]"
                        }`}
                      />
                      {hasFieldChanged("total_amount_rm") && (
                        <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)]">
                          Edited from original extraction
                        </span>
                      )}
                    </label>
                    <label className="text-[var(--text-xs)] text-[var(--color-ink-2)]">
                      Billing days
                      <input
                        type="number"
                        value={extractedData?.billing_days ?? ""}
                        onChange={(e) => handleExtractedFieldChange("billing_days", e.target.value)}
                        className={`mt-1 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] ${
                          hasFieldChanged("billing_days") ? "border-[var(--color-accent)] bg-[var(--color-paper-2)]" : "border-[var(--color-border)]"
                        }`}
                      />
                      {hasFieldChanged("billing_days") && (
                        <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)]">
                          Edited from original extraction
                        </span>
                      )}
                    </label>
                  </div>
                  {changedFields.length > 0 && (
                    <div className="rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-white px-4 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-accent)]">Confirm Corrected Values</p>
                      <p className="mt-2 text-[var(--text-xs)] text-[var(--color-ink-2)]">
                        You corrected: {changedFields.join(", ")}. These reviewed values will be used for diagnosis and help improve future extraction quality.
                      </p>
                    </div>
                  )}
                  {shouldVerifyBeforeContinue && (
                    <p className="text-[var(--text-xs)] text-[#9a3412]">
                      We found missing fields, lower confidence, or a low-trust extraction path. Double-check the values before moving into diagnosis.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Structured JSON Output Card */}
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-paper-2)] flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--text-sm)] text-[var(--color-ink)] flex items-center">
                    <FileJson className="w-4 h-4 mr-2 text-[var(--color-ink-3)]" />
                    Bill Summary
                  </h3>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <div className="flex items-center text-[var(--text-xs)] font-medium text-[var(--color-ink)] px-2 py-1 bg-white rounded-md border border-[var(--color-border)]">
                      {extractionSourceLabel}
                    </div>
                    <div className="flex items-center text-[var(--text-xs)] font-medium text-[var(--color-success)] px-2 py-1 bg-[var(--color-success-bg)] rounded-md">
                      <Check className="w-3 h-3 mr-1" /> {confidencePercent ? `Confidence ${confidencePercent}` : "Ready"}
                    </div>
                  </div>
                </div>

                {Array.isArray(extractedData?.extraction_notes) && extractedData.extraction_notes.length > 0 && (
                  <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-paper-2)] space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">What We Found On Your Bill</p>
                      <p className="mt-1 text-[var(--text-sm)] text-[var(--color-ink-2)]">
                        We reviewed the uploaded bill and pulled the key details below for you to verify before continuing.
                      </p>
                    </div>
                    {extractedData.extraction_notes.map((note: string, index: number) => (
                      <div key={`${note}-${index}`} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3">
                        <p className="text-[var(--text-xs)] text-[var(--color-ink-2)]">
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="p-6 space-y-6 bg-white border-t border-[var(--color-border)]">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
                          <CalendarDays className="w-4 h-4 text-[var(--color-ink-2)]" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Billing Month</p>
                          <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">{extractedData.billing_month || "-"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
                          <Banknote className="w-4 h-4 text-[var(--color-accent)]" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Total Amount</p>
                          <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-accent)]">
                            {typeof extractedData.total_amount_rm === "number" ? `RM ${extractedData.total_amount_rm.toFixed(2)}` : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
                          <Gauge className="w-4 h-4 text-[var(--color-ink)]" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Consumption</p>
                          <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">
                            {typeof extractedData.consumption_kwh === "number" ? `${extractedData.consumption_kwh} kWh` : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper-2)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
                          <Clock3 className="w-4 h-4 text-[var(--color-ink-2)]" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Billing Days</p>
                          <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">
                            {typeof extractedData.billing_days === "number" ? `${extractedData.billing_days} days` : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(typeof extractedData.peak_usage_kwh === "number" && typeof extractedData.off_peak_usage_kwh === "number") ||
                  (Array.isArray(extractedData.inferred_equipment) && extractedData.inferred_equipment.length > 0) ? (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {typeof extractedData.peak_usage_kwh === "number" && typeof extractedData.off_peak_usage_kwh === "number" && (
                        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
                          <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Usage Breakdown</p>
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-[var(--radius-md)] bg-[var(--color-paper-2)] p-3">
                              <p className="text-[var(--text-xs)] text-[var(--color-ink-2)]">Peak Usage</p>
                              <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">{extractedData.peak_usage_kwh} kWh</p>
                            </div>
                            <div className="rounded-[var(--radius-md)] bg-[var(--color-paper-2)] p-3">
                              <p className="text-[var(--text-xs)] text-[var(--color-ink-2)]">Off-Peak Usage</p>
                              <p className="mt-1 text-[var(--text-base)] font-bold text-[var(--color-ink)]">{extractedData.off_peak_usage_kwh} kWh</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {Array.isArray(extractedData.inferred_equipment) && extractedData.inferred_equipment.length > 0 && (
                        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
                          <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">Detected Equipment Pattern</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {extractedData.inferred_equipment.map((equipment: string, index: number) => (
                              <span
                                key={`${equipment}-${index}`}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-[var(--text-xs)] font-medium bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-border)]"
                              >
                                {equipment}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => {
                    saveExtractionTelemetry({
                      timestamp: new Date().toISOString(),
                      source: extractedData?.source ?? "unknown",
                      confidence: typeof extractedData?.confidence === "number" ? extractedData.confidence : null,
                      missingFields,
                      correctedFields: changedFields,
                      originalValues: {
                        billing_month: originalExtractedData?.billing_month ?? null,
                        consumption_kwh: originalExtractedData?.consumption_kwh ?? null,
                        total_amount_rm: originalExtractedData?.total_amount_rm ?? null,
                        billing_days: originalExtractedData?.billing_days ?? null,
                      },
                      finalValues: {
                        billing_month: extractedData?.billing_month ?? null,
                        consumption_kwh: extractedData?.consumption_kwh ?? null,
                        total_amount_rm: extractedData?.total_amount_rm ?? null,
                        billing_days: extractedData?.billing_days ?? null,
                      },
                    });
                    saveBillSnapshot(extractedData);
                    buildReliabilityMessage(extractedData?.source ?? "unknown");
                    router.push("/onboard");
                  }}
                  disabled={missingFields.length > 0 || blockedByReliability}
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-border)] disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm transition-colors flex items-center"
                >
                  {missingFields.length > 0
                    ? "Complete Required Bill Fields"
                    : blockedByReliability
                      ? "Review Flagged Fields To Continue"
                    : shouldVerifyBeforeContinue
                      ? "Continue With Reviewed Bill"
                      : "Proceed to Equipment Inference"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
