"use client";

import { useState } from "react";
import { PlayCircle, AlertTriangle, Download, Check, X } from "lucide-react";

export default function CommunityPage() {
  const [optStatus, setOptStatus] = useState<"idle" | "running" | "rejected" | "approved">("idle");

  const runOptimisation = () => {
    setOptStatus("running");
    setTimeout(() => {
      setOptStatus("rejected");
    }, 1500);
  };

  const reoptimise = () => {
    setOptStatus("running");
    setTimeout(() => {
      setOptStatus("approved");
    }, 1500);
  };

  return (
    <div className="max-w-[var(--page-width)] mx-auto px-6 pt-12 pb-24">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar - Profile Details */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div>
            <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)] leading-tight">
              Community Hub
            </h1>
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
              Solar Alpha Region
            </p>
          </div>
          
          <div className="flex gap-4">
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Status</p>
              <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-success)] bg-[var(--color-success-bg)] px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Nodes</p>
              <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-ink-2)] bg-[var(--color-paper-3)] px-2 py-0.5 rounded">
                4 SMEs
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-3">
              Environment
            </h3>
            <ul className="text-[var(--text-sm)] text-[var(--color-ink-2)] space-y-2">
              <li><strong>Solar Capacity:</strong> 120 kWp</li>
              <li><strong>Flex Pool:</strong> 90 kWh</li>
              <li><strong>Baseline Import:</strong> 52 kWh</li>
            </ul>
          </div>
          
          <div className="pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-3">
              Actions
            </h3>
            <button 
              onClick={runOptimisation}
              disabled={optStatus === "running"}
              className="w-full bg-white border border-[var(--color-border)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] px-4 py-2 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4 mr-2" /> Start Optimisation
            </button>
            {optStatus === "approved" && (
              <button 
                onClick={() => window.print()}
                className="w-full mt-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium transition-colors flex items-center justify-center shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" /> Export Report
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* Tabs */}
          <div className="flex border-b border-[var(--color-border)] mb-6">
            <button 
              className="px-4 py-2 text-[var(--text-sm)] font-medium transition-colors border-b-2 -mb-px text-[var(--color-accent)] border-[var(--color-accent)]"
            >
              Overview
            </button>
          </div>

          <div className="space-y-10">
              {/* Section: Optimisation Runs */}
              <section>
                <h2 className="text-[var(--text-base)] font-bold text-[var(--color-ink)] mb-4">Optimisation Runs</h2>
                
                <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden bg-white">
                  <table className="w-full text-left text-[var(--text-sm)]">
                    <thead className="bg-[var(--color-paper-2)] border-b border-[var(--color-border)]">
                      <tr>
                        <th className="px-4 py-3 font-medium text-[var(--color-ink-2)]">RUN ID</th>
                        <th className="px-4 py-3 font-medium text-[var(--color-ink-2)]">STATUS</th>
                        <th className="px-4 py-3 font-medium text-[var(--color-ink-2)]">TARGET</th>
                        <th className="px-4 py-3 font-medium text-[var(--color-ink-2)] text-right">RESULTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {optStatus === "running" && (
                        <tr>
                          <td className="px-4 py-3 text-[var(--color-ink)] font-medium">OPT-0023</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-ink-2)] bg-[var(--color-paper-3)] px-2 py-0.5 rounded">
                              <div className="w-3 h-3 border border-[var(--color-ink-3)] border-t-transparent rounded-full animate-spin mr-1"></div> Running
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-ink-2)]">Maximum Solar</td>
                          <td className="px-4 py-3 text-[var(--color-ink-3)] text-right">Calculating...</td>
                        </tr>
                      )}
                      {(optStatus === "rejected" || optStatus === "approved") && (
                        <tr>
                          <td className="px-4 py-3 text-[var(--color-ink)] font-medium">OPT-0023</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-error)] bg-[var(--color-error-bg)] px-2 py-0.5 rounded">
                              <X className="w-3 h-3 mr-1" /> Failed Constraint
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-ink-2)]">Maximum Solar</td>
                          <td className="px-4 py-3 text-[var(--color-ink-3)] text-right">Rejected by Risk Agent</td>
                        </tr>
                      )}
                      {optStatus === "approved" && (
                        <tr>
                          <td className="px-4 py-3 text-[var(--color-ink)] font-medium">OPT-0024</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-success)] bg-[var(--color-success-bg)] px-2 py-0.5 rounded">
                              <Check className="w-3 h-3 mr-1" /> Succeeded
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-ink-2)]">Max Solar (Adjusted)</td>
                          <td className="px-4 py-3 text-[var(--color-ink)] font-medium text-right">89% Solar Utilisation</td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-4 py-3 text-[var(--color-ink)] font-medium">OPT-0022</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-success)] bg-[var(--color-success-bg)] px-2 py-0.5 rounded">
                            <Check className="w-3 h-3 mr-1" /> Succeeded
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink-2)]">Load Balancing</td>
                        <td className="px-4 py-3 text-[var(--color-ink-2)] text-right">64% Solar Utilisation</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-[var(--color-ink)] font-medium">OPT-0021</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-success)] bg-[var(--color-success-bg)] px-2 py-0.5 rounded">
                            <Check className="w-3 h-3 mr-1" /> Succeeded
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink-2)]">Cost Minimization</td>
                        <td className="px-4 py-3 text-[var(--color-ink-2)] text-right">RM 840.00 Saved</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section: Metrics */}
              <section>
                <h2 className="text-[var(--text-base)] font-bold text-[var(--color-ink)] mb-4">Network Metrics</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-6 bg-white">
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Solar Utilisation</p>
                    <p className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)]">
                      {optStatus === "approved" ? "89%" : "64%"}
                    </p>
                  </div>
                  
                  <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-6 bg-white">
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Grid Import</p>
                    <p className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)]">
                      {optStatus === "approved" ? "37 kWh" : "52 kWh"}
                    </p>
                  </div>
                </div>
              </section>
            </div>
        </div>

        {/* Right Sidebar - KitaAI Insights (The "Customer insights" panel equivalent) */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm sticky top-20 overflow-hidden flex flex-col max-h-[calc(100vh-6rem)]">
            <div className="bg-[var(--color-accent)] text-white px-4 py-2 text-[var(--text-xs)] font-bold tracking-wider flex items-center justify-between">
              KITAAI AGENTS
            </div>
            
            <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-paper-2)]">
              <h3 className="text-[var(--text-base)] font-bold text-[var(--color-ink)]">Risk Agent Insights</h3>
              <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
                See the latest validation feedback for the current schedule.
              </p>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              
              {optStatus === "idle" && (
                <div className="text-[var(--text-sm)] text-[var(--color-ink-3)] text-center py-8">
                  Run an optimisation to see insights.
                </div>
              )}

              {optStatus === "running" && (
                <div className="text-[var(--text-sm)] text-[var(--color-ink-2)] text-center py-8 flex flex-col items-center">
                  <div className="w-6 h-6 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-3"></div>
                  Analyzing constraints...
                </div>
              )}

              {optStatus === "rejected" && (
                <div className="space-y-4 animate-in fade-in duration-[var(--dur-base)]">
                  <div className="flex items-start text-[var(--text-sm)]">
                    <AlertTriangle className="w-4 h-4 text-[var(--color-error)] mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[var(--color-ink)]">Constraint Violation</p>
                      <p className="text-[var(--color-ink-2)] mt-1">
                        The schedule placed 20 kWh of washing load inside Aisyah Laundry's busiest customer period (12:00 - 14:00).
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={reoptimise}
                    className="w-full bg-white border border-[var(--color-border)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] px-3 py-2 rounded-[var(--radius-sm)] text-[var(--text-sm)] font-medium transition-colors"
                  >
                    Apply Fix & Re-run
                  </button>
                </div>
              )}

              {optStatus === "approved" && (
                <div className="space-y-4 animate-in fade-in duration-[var(--dur-base)]">
                  <div className="flex items-start text-[var(--text-sm)]">
                    <Check className="w-4 h-4 text-[var(--color-success)] mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[var(--color-ink)]">Schedule Validated</p>
                      <p className="text-[var(--color-ink-2)] mt-1">
                        All constraints satisfied.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <p className="font-medium text-[var(--text-sm)] text-[var(--color-ink)] mb-2">Audit Trail</p>
                    <ul className="text-[var(--text-sm)] text-[var(--color-ink-2)] space-y-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mr-2"></div>
                        8 kWh allocated at 11:00
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mr-2"></div>
                        12 kWh allocated at 15:00
                      </li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
