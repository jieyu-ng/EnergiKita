"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Check, AlertTriangle, FileJson, TrendingUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import demoBusinessBill from "@/data/demo_business_bill.json";
import demoIndividualBill from "@/data/demo_individual_bill.json";

export default function Home() {
  const router = useRouter();
  const { accountType } = useUser();
  const [step, setStep] = useState(1);
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            setExtractedData(json);
            setStep(3);
          }, 1000);
        } catch (error) {
          console.error("Invalid JSON file");
          runMockExtraction();
        }
      };
      reader.readAsText(file);
    } else {
      runMockExtraction();
    }
  };

  const runMockExtraction = () => {
    setStep(2);
    setTimeout(() => {
      if (accountType === "business") {
        setExtractedData(demoBusinessBill);
      } else {
        setExtractedData(demoIndividualBill);
      }
      setStep(3);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-32 px-6">
      <div className="max-w-[var(--content-width)] w-full text-center space-y-8">
        
        <h1 className="text-[var(--text-4xl)] md:text-5xl lg:text-6xl font-bold text-[var(--color-ink)] leading-tight tracking-tight max-w-3xl mx-auto">
          {accountType === "business" 
            ? "Energy flexibility infrastructure for modern businesses." 
            : "Energy flexibility infrastructure for modern households."}
        </h1>
        
        <p className="text-[var(--text-lg)] text-[var(--color-ink-2)] max-w-2xl mx-auto font-body">
          Turn your operational data into an actionable asset. Extract profiles, run deterministic optimisations, and connect to community solar.
        </p>

        <div className="pt-16 max-w-2xl mx-auto text-left">
          {step === 1 && (
            <>
              <div 
                onClick={runMockExtraction}
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
                <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Click to simulate electricity bill upload</p>
                <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] mt-1">Runs deterministic extraction pipeline</p>
              </div>
              <div className="mt-4 text-center">
                <button onClick={() => fileInputRef.current?.click()} className="text-[var(--text-xs)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] underline transition-colors">
                  Or upload a real .json file
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-16 bg-white flex flex-col items-center justify-center shadow-sm">
              <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
              <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                Bill Intelligence Layer running...
              </p>
            </div>
          )}

          {step === 3 && extractedData && (
            <div className="space-y-6">
              
              {/* Structured JSON Output Card */}
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-paper-2)] flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--text-sm)] text-[var(--color-ink)] flex items-center">
                    <FileJson className="w-4 h-4 mr-2 text-[var(--color-ink-3)]" />
                    Bill Intelligence Output
                  </h3>
                  <div className="flex items-center text-[var(--text-xs)] font-medium text-[var(--color-success)] px-2 py-1 bg-[var(--color-success-bg)] rounded-md">
                    <Check className="w-3 h-3 mr-1" /> Verified Data
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border-t border-[var(--color-border)]">
                  <div>
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Billing Month</p>
                    <p className="text-[var(--text-base)] font-bold text-[var(--color-ink)]">{extractedData.billing_month}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-[var(--text-base)] font-bold text-[var(--color-accent)]">RM {extractedData.total_amount_rm.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Consumption</p>
                    <p className="text-[var(--text-base)] font-bold text-[var(--color-ink)]">{extractedData.consumption_kwh} kWh</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Confidence</p>
                    <p className="text-[var(--text-base)] font-bold text-[var(--color-success)]">{(extractedData.confidence * 100).toFixed(0)}%</p>
                  </div>
                  
                  {extractedData.peak_usage_kwh && (
                    <>
                      <div className="col-span-2 md:col-span-2 pt-4 border-t border-[var(--color-border)]">
                        <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-2">Usage Breakdown</p>
                        <div className="flex items-center gap-4 text-[var(--text-sm)]">
                          <div className="bg-[var(--color-paper-2)] px-3 py-1.5 rounded-md border border-[var(--color-border)]">
                            <span className="text-[var(--color-ink-2)] mr-2">Peak:</span>
                            <span className="font-bold text-[var(--color-ink)]">{extractedData.peak_usage_kwh} kWh</span>
                          </div>
                          <div className="bg-[var(--color-paper-2)] px-3 py-1.5 rounded-md border border-[var(--color-border)]">
                            <span className="text-[var(--color-ink-2)] mr-2">Off-Peak:</span>
                            <span className="font-bold text-[var(--color-ink)]">{extractedData.off_peak_usage_kwh} kWh</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-2 md:col-span-2 pt-4 border-t border-[var(--color-border)]">
                        <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-2">Inferred Equipment Load</p>
                        <div className="flex flex-wrap gap-2">
                          {extractedData.inferred_equipment?.map((eq: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-[var(--text-xs)] font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {accountType === "business" && (
                <div className="bg-white rounded-[var(--radius-lg)] border border-[#fca5a5] shadow-sm overflow-hidden relative mt-6">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#ef4444]"></div>
                  <div className="p-6 pl-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-[var(--text-base)] text-[var(--color-ink)] flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-[#ef4444]" />
                          Unusual Usage Spiked Detected
                        </h3>
                        <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
                          Your electricity usage has spiked recently compared to your normal habits.
                        </p>
                      </div>
                      <span className="inline-flex items-center text-[var(--text-xs)] font-bold text-[#b91c1c] bg-[#fee2e2] px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Requires Attention
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-[var(--color-paper-2)] p-3 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                        <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider">Usage Increase</p>
                        <p className="text-[var(--text-lg)] font-bold text-[var(--color-ink)]">{accountType === "business" ? "+18.6%" : "+21.4%"}</p>
                      </div>
                      <div className="bg-[var(--color-paper-2)] p-3 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                        <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider">Your Normal Usage</p>
                        <p className="text-[var(--text-lg)] font-bold text-[var(--color-ink)]">{accountType === "business" ? "1197 kWh" : "480 kWh"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => router.push("/onboard")}
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm transition-colors flex items-center"
                >
                  Proceed to Equipment Inference
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
