"use client";

import { useState } from "react";
import Link from "next/link";
import { Sun, ArrowRight, Zap, Target, Box, RefreshCw, Sliders, Settings, Cpu, ChevronRight } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import demoAiAdvice from "@/data/demo_ai_advice.json";

export default function PassportPage() {
  const { accountType } = useUser();
  
  // step 1: Dashboard with default cards
  // step 2: Questionnaire
  const [step, setStep] = useState(1);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [willingToDelay, setWillingToDelay] = useState(true);
  const [hasSmartPlugs, setHasSmartPlugs] = useState(false);
  const [optimizationGoal, setOptimizationGoal] = useState("cost");

  // Profile data varies by account type
  const profileName = accountType === "business" ? "Aisyah Laundry" : "Terrace House Lot 14";

  return (
    <div className="max-w-[var(--page-width)] mx-auto px-6 pt-12 pb-24">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Profile Details */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div>
            <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)] leading-tight">
              {profileName}
            </h1>
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
              Energy Passport
            </p>
          </div>
          
          <div className="pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-3">
              Solar Tech Agent Estimates
            </h3>
            <ul className="text-[var(--text-sm)] text-[var(--color-ink-2)] space-y-3">
              <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                <span>Daily Generation:</span>
                <span className="font-medium text-[var(--color-ink)]">30.4 kWh</span>
              </li>
              <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                <span>Self-Consumed:</span>
                <span className="font-medium text-[var(--color-ink)]">22.1 kWh</span>
              </li>
              <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                <span>Surplus Energy:</span>
                <span className="font-medium text-[var(--color-accent)]">8.3 kWh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Dashboard Big Card: Analysis Complete */}
          <div className="bg-white border border-[var(--color-success)] rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="text-[var(--text-xl)] font-bold text-[var(--color-ink)] mb-4 flex items-center">
              <Cpu className="w-6 h-6 mr-3 text-[var(--color-success)]" />
              Analysis Complete
            </h3>
            <div className="text-[var(--text-base)] text-[var(--color-ink-2)] space-y-4">
              <p className="leading-relaxed">
                Your AC units are consuming approximately <strong>{demoAiAdvice.ac_consumption_percentage}% of your RM {demoAiAdvice.base_bill_rm} bill</strong>. Since you use continuous cooking and water heating, your peak loads hit during the {demoAiAdvice.peak_load_time}.
              </p>
              <div className="p-4 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[var(--radius-md)]">
                <p className="text-[var(--text-sm)] font-medium text-[#065f46]">
                  💡 Advice: {demoAiAdvice.advice}
                </p>
              </div>
            </div>
          </div>

          <div className="flex border-b border-[var(--color-border)] mb-6">
            <h2 className="px-4 py-2 text-[var(--text-base)] font-bold text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] -mb-px">
              Solar Credit Trader Strategies
            </h2>
          </div>

          <div className="space-y-8">
            {step === 1 ? (
              <section className="animate-in fade-in duration-500">
                <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mb-6">
                  The Solar Credit Trader has evaluated strategies for your remaining 8.3 kWh surplus generation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Shift Equipment */}
                  <div 
                    onClick={() => {
                      if (!hasCompletedQuestionnaire) {
                        setStep(2);
                      }
                    }}
                    className={`border rounded-[var(--radius-md)] p-5 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all ${!hasCompletedQuestionnaire ? "cursor-pointer border-dashed border-[var(--color-accent)] bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10 group" : "border-[var(--color-accent)] bg-white"}`}
                  >
                    {hasCompletedQuestionnaire && (
                      <div className="absolute top-0 right-0 bg-[var(--color-accent)] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-bl-md">Optimal</div>
                    )}
                    <div>
                      <div className="flex items-center mb-2 justify-between">
                        <div className="flex items-center">
                          <RefreshCw className="w-5 h-5 text-[var(--color-accent)] mr-2" />
                          <h3 className="font-bold text-[var(--text-sm)] text-[var(--color-ink)]">1. Shift Equipment</h3>
                        </div>
                        {!hasCompletedQuestionnaire && <ChevronRight className="w-4 h-4 text-[var(--color-accent)] group-hover:translate-x-1 transition-transform" />}
                      </div>
                      
                      {!hasCompletedQuestionnaire ? (
                        <p className="text-[var(--text-sm)] text-[var(--color-accent)] font-medium mt-2">
                          Click here to configure your equipment flexibility and unlock load shifting strategies.
                        </p>
                      ) : (
                        <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-2">
                          {willingToDelay 
                            ? (hasSmartPlugs 
                                ? "AI will automatically trigger smart plugs to run heavy equipment at night during off-peak hours." 
                                : "Manually delay your heavy equipment usage to off-peak night hours to maximize your savings.")
                            : "Run equipment during peak solar hours (11am - 2pm) since you require immediate usage."}
                        </p>
                      )}
                    </div>
                    
                    {hasCompletedQuestionnaire && (
                      <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                        <span className="text-[var(--text-xs)] font-medium text-[var(--color-ink-3)] uppercase tracking-wider">Result:</span>
                        <p className="text-[var(--text-sm)] font-bold text-[var(--color-accent)] mt-1">
                          {willingToDelay ? "Absorbs 5.2 kWh / day" : "Absorbs 4.5 kWh / day"}
                        </p>
                      </div>
                    )}
                  </div>

                  <Link href="/wallet" className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 bg-white shadow-sm flex flex-col justify-between hover:border-[var(--color-success)] hover:bg-[#ecfdf5]/50 transition-all cursor-pointer group">
                    <div>
                      <div className="flex items-center mb-2 justify-between">
                        <div className="flex items-center">
                          <Zap className="w-5 h-5 text-[var(--color-success)] mr-2" />
                          <h3 className="font-bold text-[var(--text-sm)] text-[var(--color-ink)]">2. Export Surplus</h3>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--color-success)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-2">
                        Export the remaining inflexible surplus back to the TNB grid. Click to view Energy Credit Wallet options.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                      <span className="text-[var(--text-xs)] font-medium text-[var(--color-ink-3)] uppercase tracking-wider">Result:</span>
                      <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)] mt-1">Earns RM 0.25/kWh export credit</p>
                    </div>
                  </Link>

                  {accountType === "business" && (
                    <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 bg-[var(--color-paper-2)] shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <Box className="w-5 h-5 text-[var(--color-ink-2)] mr-2" />
                          <h3 className="font-bold text-[var(--text-sm)] text-[var(--color-ink)]">3. Virtual Allocation (NOVA)</h3>
                        </div>
                        <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-2">
                          Pass export credits to designated business branches via grid offset.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                        <span className="text-[var(--text-xs)] font-medium text-[var(--color-ink-3)] uppercase tracking-wider">Result:</span>
                        <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)] mt-1">Offsets high-bill branches</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 mt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                  <div className="text-[var(--text-sm)] text-[var(--color-ink-2)]">
                    Pass these strategies to the Optimisation Engine to build the final schedule.
                  </div>
                  <Link href="/community">
                    <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm transition-colors flex items-center">
                      Run Optimisation Engine <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </Link>
                </div>
              </section>
            ) : (
              <section className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-sm animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center mb-6">
                  <Sliders className="w-6 h-6 text-[var(--color-accent)] mr-3" />
                  <div>
                    <h2 className="text-[var(--text-xl)] font-bold text-[var(--color-ink)]">Determine Your Flexibility</h2>
                    <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
                      Our agent can trade your surplus solar energy or use it to power your own heavy appliances. Tell us how flexible your schedule is.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-[var(--text-base)] font-semibold text-[var(--color-ink)]">
                      1. Are you willing to delay running heavy equipment (e.g. washing machines, dryers, EV charging) to run automatically during off-peak night hours to maximize savings?
                    </label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setWillingToDelay(true)}
                        className={`px-6 py-3 rounded-[var(--radius-md)] border font-medium transition-all ${willingToDelay ? 'bg-[var(--color-success-bg)] border-[var(--color-success)] text-[var(--color-success)]' : 'bg-white border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-ink-3)]'}`}
                      >
                        Yes, I can delay
                      </button>
                      <button 
                        onClick={() => setWillingToDelay(false)}
                        className={`px-6 py-3 rounded-[var(--radius-md)] border font-medium transition-all ${!willingToDelay ? 'bg-[var(--color-paper-2)] border-[var(--color-ink)] text-[var(--color-ink)]' : 'bg-white border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-ink-3)]'}`}
                      >
                        No, need it immediately
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[var(--text-base)] font-semibold text-[var(--color-ink)]">
                      2. Do you currently have smart plugs or IoT-enabled appliances that our AI can directly control?
                    </label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setHasSmartPlugs(true)}
                        className={`px-6 py-3 rounded-[var(--radius-md)] border font-medium transition-all ${hasSmartPlugs ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-white border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-ink-3)]'}`}
                      >
                        Yes, I have smart devices
                      </button>
                      <button 
                        onClick={() => setHasSmartPlugs(false)}
                        className={`px-6 py-3 rounded-[var(--radius-md)] border font-medium transition-all ${!hasSmartPlugs ? 'bg-[var(--color-paper-2)] border-[var(--color-ink)] text-[var(--color-ink)]' : 'bg-white border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-ink-3)]'}`}
                      >
                        No, fully manual
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[var(--text-base)] font-semibold text-[var(--color-ink)]">
                      3. What is your primary optimization goal?
                    </label>
                    <select 
                      value={optimizationGoal} 
                      onChange={(e) => setOptimizationGoal(e.target.value)}
                      className="w-full max-w-md bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                    >
                      <option value="cost">Maximum Cost Savings (RM)</option>
                      <option value="carbon">Maximum Carbon Reduction (CO2)</option>
                      <option value="balanced">Balanced Approach</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-[var(--color-border)] flex justify-end gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-[var(--text-sm)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] font-medium transition-colors px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setHasCompletedQuestionnaire(true);
                        setStep(1);
                      }}
                      className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-8 py-3 rounded-[var(--radius-md)] text-[var(--text-base)] font-bold shadow-sm transition-colors flex items-center"
                    >
                      Save & Update Strategies <Settings className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </section>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
