"use client";

import { useState } from "react";
import { PlayCircle, AlertTriangle, ArrowRight, Download, CheckCircle2 } from "lucide-react";

export default function CommunityPage() {
  const [optStatus, setOptStatus] = useState<"idle" | "running" | "rejected" | "approved">("idle");
  const [activeTab, setActiveTab] = useState("scenario");

  const runOptimisation = () => {
    setOptStatus("running");
    setTimeout(() => {
      setOptStatus("rejected");
    }, 2000);
  };

  const reoptimise = () => {
    setOptStatus("running");
    setTimeout(() => {
      setOptStatus("approved");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center pt-16 px-6 relative">
      {/* Background glow specific to this page */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[var(--color-accent)]/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      <div className="max-w-[var(--content-width)] w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-[var(--dur-base)]">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4">
          <div className="space-y-4">
            <div className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-accent)] px-3 py-1.5 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-full uppercase tracking-wider">
              Operator Hub
            </div>
            <h1 className="text-[var(--text-4xl)] font-display text-[var(--color-ink)] leading-tight">
              Community Dashboard
            </h1>
            <p className="text-[var(--text-lg)] text-[var(--color-ink-2)] max-w-lg">
              Run deterministic scheduling optimisations on connected SME flexibility passports.
            </p>
          </div>
        </div>

        <div className="bg-[var(--glass-bg)] backdrop-blur-2xl rounded-[var(--radius-2xl)] border border-[var(--glass-border)] shadow-[var(--glass-shadow)] overflow-hidden">
          <div className="flex border-b border-[var(--color-border)] bg-[var(--color-paper)]/50 px-4 pt-4 gap-4">
            <button 
              onClick={() => setActiveTab("scenario")}
              className={`pb-4 px-4 text-[var(--text-sm)] font-medium transition-all relative ${activeTab === "scenario" ? "text-[var(--color-accent)]" : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"}`}
            >
              Simulation Scenario
              {activeTab === "scenario" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)] shadow-[0_-2px_10px_rgba(var(--color-accent),0.5)]"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("results")}
              disabled={optStatus === "idle" || optStatus === "running"}
              className={`pb-4 px-4 text-[var(--text-sm)] font-medium transition-all relative disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === "results" ? "text-[var(--color-accent)]" : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"}`}
            >
              Optimisation Results
              {activeTab === "results" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)] shadow-[0_-2px_10px_rgba(var(--color-accent),0.5)]"></div>
              )}
            </button>
          </div>

          <div className="p-8 md:p-12">
            {activeTab === "scenario" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-[var(--dur-base)]">
                <div className="col-span-1 space-y-6">
                  <div>
                    <h3 className="text-[var(--text-xl)] font-display text-[var(--color-ink)]">Solar Alpha</h3>
                    <p className="text-[var(--text-sm)] text-[var(--color-ink-3)] mt-1">Simulated Environment</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex justify-between items-center">
                      <span className="text-[var(--text-sm)] text-[var(--color-ink-2)] font-medium">Capacity</span>
                      <span className="text-[var(--text-lg)] font-display text-[var(--color-ink)]">120 kWp</span>
                    </div>
                    <div className="bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex justify-between items-center">
                      <span className="text-[var(--text-sm)] text-[var(--color-ink-2)] font-medium">Consumers</span>
                      <span className="text-[var(--text-lg)] font-display text-[var(--color-ink)]">4 Nodes</span>
                    </div>
                    <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-[var(--radius-lg)] p-4 flex justify-between items-center">
                      <span className="text-[var(--text-sm)] text-[var(--color-accent)] font-medium">Flex Pool</span>
                      <span className="text-[var(--text-lg)] font-display text-[var(--color-accent)]">90 kWh</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 md:pl-8">
                  <div className="h-full flex flex-col justify-center border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 bg-[var(--color-paper)]/30">
                    
                    {optStatus === "idle" && (
                      <div className="text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-ink)]/5 mx-auto flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-[var(--color-ink-3)]" />
                        </div>
                        <div>
                          <h3 className="text-[var(--text-xl)] font-display text-[var(--color-ink)]">Run Optimisation</h3>
                          <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-2 max-w-sm mx-auto">Target: Maximum Local Solar, Balanced Plan</p>
                        </div>
                        <button onClick={runOptimisation} className="inline-flex items-center justify-center bg-[var(--color-ink)] text-white rounded-full px-8 py-4 font-medium hover:bg-[var(--color-accent)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                          <PlayCircle className="w-5 h-5 mr-3" /> Start Engine
                        </button>
                      </div>
                    )}

                    {optStatus === "running" && (
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
                          <div className="absolute inset-0 bg-[var(--color-accent)]/20 blur-xl rounded-full"></div>
                        </div>
                        <p className="text-[var(--text-lg)] font-display text-[var(--color-ink)]">Running OR-Tools MILP solver...</p>
                      </div>
                    )}

                    {optStatus === "rejected" && (
                      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-[var(--dur-fast)] text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-error)]/10 mx-auto flex items-center justify-center border border-[var(--color-error)]/20 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
                          <AlertTriangle className="w-8 h-8 text-[var(--color-error)]" />
                        </div>
                        <div>
                          <h3 className="text-[var(--text-xl)] font-display text-[var(--color-error)] mb-2">Risk Agent: Plan Rejected</h3>
                          <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] max-w-md mx-auto">
                            Violation: The schedule placed 20 kWh of washing load inside Aisyah Laundry's busiest customer period (12:00 - 14:00).
                          </p>
                        </div>
                        <button onClick={reoptimise} className="inline-flex items-center justify-center border-2 border-[var(--color-error)]/30 text-[var(--color-error)] rounded-full px-8 py-4 font-medium hover:bg-[var(--color-error)]/5 transition-colors">
                          Apply Constraint & Re-optimise
                        </button>
                      </div>
                    )}

                    {optStatus === "approved" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-[var(--dur-base)] text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 mx-auto flex items-center justify-center border border-[var(--color-success)]/20 shadow-[0_0_20px_rgba(0,255,0,0.1)]">
                          <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
                        </div>
                        <div>
                          <h3 className="text-[var(--text-xl)] font-display text-[var(--color-success)] mb-2">Plan Approved</h3>
                          <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] max-w-md mx-auto">
                            Schedule successfully revised to protect critical customer periods.
                          </p>
                        </div>
                        <button onClick={() => setActiveTab("results")} className="inline-flex items-center justify-center bg-[var(--color-success)] text-white rounded-full px-8 py-4 font-medium hover:bg-[var(--color-success)]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                          View Results <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "results" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-8 duration-[var(--dur-base)]">
                <div className="bg-[var(--color-paper)]/40 rounded-[var(--radius-xl)] border border-[var(--color-border)] p-8 space-y-6">
                  <div>
                    <h3 className="text-[var(--text-xl)] font-display text-[var(--color-ink)]">Impact Summary</h3>
                    <p className="text-[var(--text-sm)] text-[var(--color-ink-3)] mt-1">Before vs After Optimisation</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-[var(--color-paper)] p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] flex items-center justify-between shadow-sm">
                      <span className="text-[var(--text-sm)] font-medium text-[var(--color-ink-2)] uppercase tracking-wider">Solar Utilisation</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-[var(--text-lg)] text-[var(--color-ink-3)] line-through decoration-[var(--color-error)]/50">64%</span>
                        <ArrowRight className="w-5 h-5 text-[var(--color-ink-3)]" />
                        <span className="text-[var(--text-3xl)] font-display text-[var(--color-success)]">89%</span>
                      </div>
                    </div>
                    
                    <div className="bg-[var(--color-paper)] p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] flex items-center justify-between shadow-sm">
                      <span className="text-[var(--text-sm)] font-medium text-[var(--color-ink-2)] uppercase tracking-wider">Grid Import</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-[var(--text-lg)] text-[var(--color-ink-3)] line-through decoration-[var(--color-error)]/50">52 kWh</span>
                        <ArrowRight className="w-5 h-5 text-[var(--color-ink-3)]" />
                        <span className="text-[var(--text-3xl)] font-display text-[var(--color-success)]">37 kWh</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[var(--color-paper)]/40 rounded-[var(--radius-xl)] border border-[var(--color-border)] p-8 h-full flex flex-col">
                    <div>
                      <h3 className="text-[var(--text-xl)] font-display text-[var(--color-ink)]">Explanation Agent</h3>
                      <p className="text-[var(--text-sm)] text-[var(--color-ink-3)] mt-1">Audit Trail</p>
                    </div>
                    
                    <div className="mt-6 flex-1 text-[var(--text-sm)] text-[var(--color-ink-2)] space-y-4">
                      <p className="font-medium text-[var(--color-ink)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] p-3 rounded-lg border border-[var(--color-accent)]/20">
                        Action: Shifted washing cycles to solar window.
                      </p>
                      <p className="leading-relaxed">
                        Solar production is expected to be highest between 11:00 and 16:00. To strictly avoid Aisyah Laundry's busiest period (12:00 - 14:00), the revised plan schedules:
                      </p>
                      <ul className="space-y-3 mt-4">
                        <li className="flex items-center text-[var(--color-ink)] bg-[var(--color-paper)] p-3 rounded-lg border border-[var(--color-border)]">
                          <CheckCircle2 className="w-4 h-4 mr-3 text-[var(--color-success)]" /> 8 kWh allocated at 11:00
                        </li>
                        <li className="flex items-center text-[var(--color-ink)] bg-[var(--color-paper)] p-3 rounded-lg border border-[var(--color-border)]">
                          <CheckCircle2 className="w-4 h-4 mr-3 text-[var(--color-success)]" /> 12 kWh allocated at 15:00
                        </li>
                      </ul>
                    </div>

                    <div className="pt-8">
                      <button onClick={() => window.print()} className="flex items-center justify-center w-full bg-[var(--color-ink)] text-white rounded-full py-4 text-[var(--text-sm)] font-medium hover:bg-[var(--color-accent)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                        <Download className="w-5 h-5 mr-2" /> Export Final PDF Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
