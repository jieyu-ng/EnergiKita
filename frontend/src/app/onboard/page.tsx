"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, CheckCircle2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function OnboardPage() {
  const router = useRouter();
  const { accountType } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qStep, setQStep] = useState(1);
  const [acCount, setAcCount] = useState(2);
  const [fridgeCount, setFridgeCount] = useState(1);
  const [heaterHours, setHeaterHours] = useState(2);
  const [cookingType, setCookingType] = useState("induction");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (accountType === "business") {
        router.push("/passport");
      } else {
        setIsSubmitting(false);
        setQStep(2);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center pt-16 pb-32 px-6">
      <div className="max-w-[var(--content-width)] w-full max-w-2xl space-y-8">
        
        {accountType === "business" && (
          <div className="bg-[var(--color-paper-2)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[var(--text-base)] font-bold text-[var(--color-ink)] flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
                Equipment Inference Agent
              </h2>
              <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-ink-2)] bg-[var(--color-paper-3)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                Confidence: 0.71
              </span>
            </div>
            
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
              <p className="text-[var(--text-sm)] text-[var(--color-ink)] font-medium mb-3">
                Probable Contributor: <span className="text-[var(--color-accent)]">Air Conditioning / Continuous Refrigeration</span>
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
                Business & Solar Context Input
              </h1>
              <p className="text-[var(--text-base)] text-[var(--color-ink-2)]">
                Verify the inferred equipment and provide operational constraints for the solar routing engine.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm p-8 space-y-8 relative">
                
                {isSubmitting && (
                  <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center rounded-[var(--radius-lg)]">
                    <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                      Simulating Solar Scenarios...
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-border)]">Business Constraints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Primary Equipment</label>
                      <input 
                        type="text" 
                        defaultValue="Air Conditioning & Dryers" 
                        className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Flexible Equipment</label>
                      <input 
                        type="text" 
                        defaultValue="Washing cycles (1-2 hour delay ok)" 
                        className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Operating Hours vs Busy Hours</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input type="time" defaultValue="08:00" className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)]" />
                          <span className="text-[var(--text-sm)] text-[var(--color-ink-2)]">to</span>
                          <input type="time" defaultValue="22:00" className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)]" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[var(--text-sm)] text-[var(--color-ink-2)] font-medium mr-2">Peak:</span>
                          <input type="time" defaultValue="12:00" className="w-full border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)]" />
                          <span className="text-[var(--text-sm)] text-[var(--color-ink-2)]">-</span>
                          <input type="time" defaultValue="14:00" className="w-full border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-border)]">Solar Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Solar Capacity (kWp)</label>
                      <input 
                        type="number" 
                        defaultValue="12" 
                        className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Import Rate (RM/kWh)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        defaultValue="0.50" 
                        className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Export Credit (RM/kWh)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        defaultValue="0.25" 
                        className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="text-[var(--text-sm)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] font-medium transition-colors px-4 py-2"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm disabled:opacity-50 transition-colors"
                >
                  Pass to Solar Tech Agent
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
                    Household Equipment Profile
                  </h1>
                  <p className="text-[var(--text-base)] text-[var(--color-ink-2)]">
                    Tell us about your home appliances to help the AI map your usage accurately.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm p-8 space-y-8 relative">
                  {isSubmitting && (
                    <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center rounded-[var(--radius-lg)]">
                      <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-success)] rounded-full animate-spin mb-4"></div>
                      <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                        Analysing load against Malaysia baselines...
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">How many Air Conditioners do you have?</label>
                      <div className="flex gap-4">
                        <input type="number" min="0" value={acCount} onChange={(e) => setAcCount(Number(e.target.value))} className="w-24 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                        <div className="flex-1 flex items-center gap-2 text-[var(--text-xs)] text-[var(--color-ink-2)]">
                          <input type="file" id="ac-upload" className="hidden" accept="image/*" />
                          <button type="button" onClick={() => document.getElementById('ac-upload')?.click()} className="px-3 py-1.5 border border-[var(--color-border)] rounded hover:bg-[var(--color-paper-2)] transition-colors text-[var(--color-ink)]">Upload AC Model Label</button>
                          <span>(Optional: Let AI read kW rating)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">How many refrigerators?</label>
                      <input type="number" min="0" value={fridgeCount} onChange={(e) => setFridgeCount(Number(e.target.value))} className="w-24 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Average daily water heater usage (hours)</label>
                      <input type="number" min="0" step="0.5" value={heaterHours} onChange={(e) => setHeaterHours(Number(e.target.value))} className="w-24 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all" />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Primary cooking method</label>
                      <select value={cookingType} onChange={(e) => setCookingType(e.target.value)} className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-success)] focus:ring-1 focus:ring-[var(--color-success)] transition-all">
                        <option value="induction">Induction / Electric Stove</option>
                        <option value="gas">Gas Stove</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--color-border)] flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="bg-[var(--color-success)] hover:bg-[#059669] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm disabled:opacity-50 transition-colors">
                      Process Data
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-[var(--text-3xl)] font-bold text-[var(--color-ink)] tracking-tight">
                    AI Energy Advice
                  </h1>
                  <p className="text-[var(--text-base)] text-[var(--color-ink-2)]">
                    Based on your profile and Malaysia TNB baselines.
                  </p>
                </div>
                
                <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-success)] shadow-sm p-6 space-y-4">
                  <div className="flex items-start">
                    <Cpu className="w-6 h-6 text-[var(--color-success)] mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-[var(--text-base)] text-[var(--color-ink)]">Analysis Complete</h3>
                      <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-2 leading-relaxed">
                        Your {acCount} AC units are consuming approximately <strong>45% of your RM 320 bill</strong>. Since you use <strong>{cookingType} cooking</strong> and {heaterHours} hours of water heating daily, your peak loads hit during the evening.
                      </p>
                      <div className="mt-4 p-4 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[var(--radius-md)]">
                        <p className="text-[var(--text-sm)] font-medium text-[#065f46]">
                          💡 Advice: Shift your {heaterHours}h water heating to off-peak daylight hours (10am-2pm). If you adopt a 6kWp solar system, this simple shift will offset an additional RM 60/month.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => router.push("/passport")}
                    className="bg-[var(--color-success)] hover:bg-[#059669] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm transition-colors"
                  >
                    Generate Home Energy Passport
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
