"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [extractedData, setExtractedData] = useState<any[]>([]);

  const handleUpload = async () => {
    setStep(2);
    setTimeout(() => {
      setExtractedData([
        { name: "Billing Month", value: "May 2026", confidence: 0.98, status: "verified" },
        { name: "Consumption (kWh)", value: "1420", confidence: 0.98, status: "verified" },
        { name: "Total Amount (RM)", value: "980", confidence: 0.65, status: "needs_confirmation" },
      ]);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center pt-16 px-6 relative">
      {/* Background glow specific to this page */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-[var(--content-width)] w-full space-y-12">
        
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-[var(--dur-base)]">
          <p className="text-[var(--text-sm)] font-medium text-[var(--color-accent)] tracking-wider uppercase">Step 1</p>
          <h1 className="text-[var(--text-4xl)] font-display text-[var(--color-ink)]">
            Upload Historical Bill
          </h1>
          <p className="text-[var(--text-lg)] text-[var(--color-ink-2)] max-w-xl mx-auto">
            Provide a recent electricity bill. KitaAI Document Agent will extract the consumption profile automatically.
          </p>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-[var(--dur-base)] delay-100">
            <div 
              onClick={handleUpload}
              className="bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-[var(--radius-2xl)] shadow-[var(--glass-shadow)] p-2 transition-all hover:shadow-[var(--glass-shadow-hover)] cursor-pointer group"
            >
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-xl)] py-24 px-6 bg-[var(--color-paper)]/50 group-hover:bg-[var(--color-paper)] group-hover:border-[var(--color-accent)]/50 transition-all">
                <div className="w-16 h-16 rounded-full bg-[var(--color-paper-2)] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--color-accent)]/10 transition-all duration-[var(--dur-base)]">
                  <UploadCloud className="w-8 h-8 text-[var(--color-ink-3)] group-hover:text-[var(--color-accent)] transition-colors" />
                </div>
                <p className="text-[var(--text-xl)] font-display text-[var(--color-ink)]">Select a PDF or Image</p>
                <p className="text-[var(--text-base)] text-[var(--color-ink-3)] mt-2">or drag and drop here to simulate</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[var(--glass-bg)] backdrop-blur-2xl rounded-[var(--radius-2xl)] border border-[var(--glass-border)] shadow-[var(--glass-shadow)] p-24 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-[var(--dur-slow)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent)]/5 to-transparent animate-[shimmer_2s_infinite] -z-10"></div>
            <div className="w-12 h-12 border-4 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(var(--color-accent),0.3)]"></div>
            <p className="text-[var(--text-xl)] font-display text-[var(--color-ink)] flex items-center">
              <Sparkles className="w-5 h-5 mr-3 text-[var(--color-accent)] animate-pulse" />
              KitaAI is extracting data...
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-[var(--dur-base)] space-y-8">
            <div className="bg-[var(--glass-bg)] backdrop-blur-2xl rounded-[var(--radius-2xl)] border border-[var(--glass-border)] shadow-[var(--glass-shadow)] overflow-hidden">
              <div className="px-8 py-6 border-b border-[var(--color-border)] bg-[var(--color-paper)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-[var(--text-xl)] text-[var(--color-ink)]">Extracted Values</h3>
                  <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">Please verify the highlighted fields.</p>
                </div>
                <span className="inline-flex items-center text-[var(--text-xs)] font-medium px-3 py-1.5 bg-[var(--color-paper)] border border-[var(--color-border)] rounded-full text-[var(--color-ink-2)] shadow-sm">
                  Confidence Score: 85%
                </span>
              </div>
              
              <div className="divide-y divide-[var(--color-border)]">
                {extractedData.map((field, idx) => (
                  <div key={idx} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[var(--color-paper)]/40 transition-colors">
                    <div className="flex-1">
                      <label className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-widest">{field.name}</label>
                      <input 
                        type="text" 
                        defaultValue={field.value} 
                        className="w-full mt-2 bg-transparent text-[var(--text-2xl)] font-display text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 rounded-lg px-3 -ml-3 py-2 transition-all" 
                      />
                    </div>
                    <div>
                      {field.status === "verified" ? (
                        <div className="flex items-center text-[var(--text-sm)] font-medium text-[var(--color-success)] px-4 py-2 rounded-full border border-[var(--color-success)]/20 bg-[var(--color-success)]/5">
                          <CheckCircle2 className="w-5 h-5 mr-2" /> Verified (98%)
                        </div>
                      ) : (
                        <div className="flex items-center text-[var(--text-sm)] font-medium text-[var(--color-error)] px-4 py-2 rounded-full border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 shadow-[0_0_10px_rgba(255,0,0,0.05)]">
                          <AlertCircle className="w-5 h-5 mr-2" /> Please confirm
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => router.push("/onboard")}
                className="bg-[var(--color-ink)] text-white px-8 py-4 rounded-full font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-[var(--color-accent)] transition-all duration-[var(--dur-base)]"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
