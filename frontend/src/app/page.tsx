"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Check, AlertCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [extractedData, setExtractedData] = useState<any[]>([]);

  const handleUpload = async () => {
    setStep(2);
    setTimeout(() => {
      setExtractedData([
        { name: "Billing Month", value: "May 2026", confidence: 0.98, status: "verified" },
        { name: "Consumption (kWh)", value: "1420", confidence: 0.98, status: "verified" },
        { name: "Total Amount (RM)", value: "980.00", confidence: 0.65, status: "needs_confirmation" },
      ]);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-32 px-6">
      <div className="max-w-[var(--content-width)] w-full text-center space-y-8">
        
        <h1 className="text-[var(--text-4xl)] md:text-5xl lg:text-6xl font-bold text-[var(--color-ink)] leading-tight tracking-tight max-w-3xl mx-auto">
          Energy flexibility infrastructure for modern businesses.
        </h1>
        
        <p className="text-[var(--text-lg)] text-[var(--color-ink-2)] max-w-2xl mx-auto font-body">
          Turn your operational data into an actionable asset. Extract profiles, run deterministic optimisations, and connect to community solar.
        </p>

        <div className="pt-16 max-w-2xl mx-auto text-left">
          {step === 1 && (
            <div 
              onClick={handleUpload}
              className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-12 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-accent)] transition-colors shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-paper-3)] flex items-center justify-center mb-4">
                <UploadCloud className="w-6 h-6 text-[var(--color-ink-2)]" />
              </div>
              <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Click to upload electricity bill or drag and drop</p>
              <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] mt-1">PDF, PNG, JPG up to 10MB</p>
            </div>
          )}

          {step === 2 && (
            <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-16 bg-white flex flex-col items-center justify-center shadow-sm">
              <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
              <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                Extracting document data...
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-paper-2)] flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--text-sm)] text-[var(--color-ink)]">Extracted Data</h3>
                  <span className="text-[var(--text-xs)] text-[var(--color-ink-2)]">Confidence: 85%</span>
                </div>
                
                <div className="divide-y divide-[var(--color-border)]">
                  {extractedData.map((field, idx) => (
                    <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <label className="text-[var(--text-xs)] font-medium text-[var(--color-ink-2)] uppercase tracking-wider">{field.name}</label>
                        <input 
                          type="text" 
                          defaultValue={field.value} 
                          className="w-full mt-1 bg-transparent text-[var(--text-base)] font-medium text-[var(--color-ink)] border border-transparent focus:border-[var(--color-border)] focus:bg-[var(--color-paper-2)] rounded px-2 -ml-2 py-1 transition-all outline-none" 
                        />
                      </div>
                      <div>
                        {field.status === "verified" ? (
                          <div className="flex items-center text-[var(--text-xs)] font-medium text-[var(--color-success)] px-2 py-1 bg-[var(--color-success-bg)] rounded-md">
                            <Check className="w-3 h-3 mr-1" /> Verified
                          </div>
                        ) : (
                          <div className="flex items-center text-[var(--text-xs)] font-medium text-[var(--color-error)] px-2 py-1 bg-[var(--color-error-bg)] rounded-md">
                            <AlertCircle className="w-3 h-3 mr-1" /> Needs review
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => router.push("/onboard")}
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm transition-colors"
                >
                  Confirm and continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
