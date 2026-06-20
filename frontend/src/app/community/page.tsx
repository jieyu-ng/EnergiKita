"use client";

import { useState } from "react";
import { PlayCircle, Leaf, Building, ArrowRight, Zap, CheckCircle2, TrendingDown } from "lucide-react";

export default function CommunityPage() {
  const [optStatus, setOptStatus] = useState<"idle" | "running" | "approved">("idle");

  const runAuction = () => {
    setOptStatus("running");
    setTimeout(() => {
      setOptStatus("approved");
    }, 2000);
  };

  return (
    <div className="max-w-[var(--page-width)] mx-auto px-6 pt-12 pb-24">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div>
            <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)] leading-tight">
              Operator Hub
            </h1>
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
              Optimisation & NOVA Allocation
            </p>
          </div>
          
          <div className="pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-3">
              Solar Credit Auction
            </h3>
            <button 
              onClick={runAuction}
              disabled={optStatus === "running" || optStatus === "approved"}
              className="w-full bg-white border border-[var(--color-border)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] px-4 py-2 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4 mr-2 text-[var(--color-accent)]" /> 
              {optStatus === "running" ? "Running Solver..." : optStatus === "approved" ? "Solver Completed" : "Run Solver"}
            </button>
            <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] mt-3 leading-relaxed">
              Objective: Maximise total savings = (avoided grid import + export credit + branch offset) - inconvenience penalty.
            </p>
          </div>

          {optStatus === "approved" && (
            <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
              <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)]">
                ESG Calculator
              </h3>
              <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-[var(--radius-md)] p-4 text-[#065f46]">
                <Leaf className="w-5 h-5 mb-2" />
                <p className="text-[var(--text-2xl)] font-bold leading-none mb-1">135 <span className="text-[var(--text-sm)] font-normal">kg</span></p>
                <p className="text-[var(--text-xs)] font-medium uppercase tracking-wider opacity-80">CO₂ Reduced / Month</p>
              </div>
              <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 text-[var(--color-ink)]">
                <TrendingDown className="w-5 h-5 mb-2 text-[var(--color-accent)]" />
                <p className="text-[var(--text-2xl)] font-bold leading-none mb-1">RM 254.70</p>
                <p className="text-[var(--text-xs)] font-medium uppercase tracking-wider text-[var(--color-ink-3)]">Total Financial Value</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area - Geographic Map & Results */}
        <div className="flex-1 min-w-0">
          <div className="flex border-b border-[var(--color-border)] mb-6">
            <button className="px-4 py-2 text-[var(--text-sm)] font-medium transition-colors border-b-2 -mb-px text-[var(--color-accent)] border-[var(--color-accent)]">
              NOVA Geographic Allocation Simulator
            </button>
          </div>

          <div className="space-y-6">
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)]">
              Visualising the flow of solar energy and virtual export credits across multiple designated business premises based on highest unpaid grid import.
            </p>

            {/* Geographic Map Visualization (CSS/SVG based) */}
            <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-paper-2)] p-8 relative overflow-hidden min-h-[400px] flex items-center justify-center">
              
              {optStatus === "idle" && (
                <div className="text-[var(--text-sm)] text-[var(--color-ink-3)] text-center">
                  Run the solver to visualize NOVA credit allocations.
                </div>
              )}

              {optStatus === "running" && (
                <div className="text-[var(--text-sm)] text-[var(--color-ink-2)] text-center flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
                  Calculating optimal branch allocation paths...
                </div>
              )}

              {optStatus === "approved" && (
                <div className="relative w-full max-w-2xl mx-auto h-[300px] animate-in fade-in zoom-in-95 duration-500">
                  {/* Central Node (Producer) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-white border-2 border-[var(--color-accent)] rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-md relative">
                      <div className="absolute -top-2 -right-2 bg-[var(--color-success)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">HQ</div>
                      <Zap className="w-6 h-6 text-[var(--color-accent)] mb-1" />
                      <span className="text-[var(--text-xs)] font-bold text-[var(--color-ink)]">Branch A</span>
                      <span className="text-[10px] text-[var(--color-ink-2)]">Solar Roof</span>
                    </div>
                  </div>

                  {/* Lines to Receivers */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {/* Line to B */}
                    <path d="M 50% 50% L 20% 20%" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                    {/* Line to C */}
                    <path d="M 50% 50% L 80% 20%" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                    {/* Line to D */}
                    <path d="M 50% 50% L 50% 85%" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                  <style jsx>{`
                    @keyframes dash {
                      to {
                        stroke-dashoffset: -1000;
                      }
                    }
                  `}</style>

                  {/* Receiver Node B */}
                  <div className="absolute top-[5%] left-[5%] z-10">
                    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 shadow-sm flex flex-col items-center w-32">
                      <Building className="w-5 h-5 text-[var(--color-ink-2)] mb-1" />
                      <span className="text-[var(--text-xs)] font-bold text-[var(--color-ink)]">Branch B</span>
                      <span className="text-[10px] text-[var(--color-success)] font-medium">+ RM 120 Offset</span>
                      <span className="text-[10px] text-[var(--color-ink-3)]">60% Allocation</span>
                    </div>
                  </div>

                  {/* Receiver Node C */}
                  <div className="absolute top-[5%] right-[5%] z-10">
                    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 shadow-sm flex flex-col items-center w-32">
                      <Building className="w-5 h-5 text-[var(--color-ink-2)] mb-1" />
                      <span className="text-[var(--text-xs)] font-bold text-[var(--color-ink)]">Branch C</span>
                      <span className="text-[10px] text-[var(--color-success)] font-medium">+ RM 60 Offset</span>
                      <span className="text-[10px] text-[var(--color-ink-3)]">30% Allocation</span>
                    </div>
                  </div>

                  {/* Receiver Node D */}
                  <div className="absolute bottom-[0%] left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 shadow-sm flex flex-col items-center w-32 opacity-70">
                      <Building className="w-5 h-5 text-[var(--color-ink-2)] mb-1" />
                      <span className="text-[var(--text-xs)] font-bold text-[var(--color-ink)]">Branch D</span>
                      <span className="text-[10px] text-[var(--color-ink-3)]">No Offset Needed</span>
                      <span className="text-[10px] text-[var(--color-ink-3)]">Low Base Load</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {optStatus === "approved" && (
              <div className="grid grid-cols-3 gap-4 text-center border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 bg-white shadow-sm">
                <div>
                  <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider">Total Surplus Exported</p>
                  <p className="text-[var(--text-lg)] font-bold text-[var(--color-ink)] mt-1">3.8 kWh</p>
                </div>
                <div className="border-l border-r border-[var(--color-border)]">
                  <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider">Credit Value Generated</p>
                  <p className="text-[var(--text-lg)] font-bold text-[var(--color-ink)] mt-1">RM 180.00</p>
                </div>
                <div>
                  <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider">Allocation Efficiency</p>
                  <p className="text-[var(--text-lg)] font-bold text-[var(--color-success)] mt-1">100% Offset</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Zero-Hallucination Recommendation Layer */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-sm sticky top-20 overflow-hidden flex flex-col max-h-[calc(100vh-6rem)]">
            <div className="bg-[var(--color-ink)] text-white px-4 py-2 text-[var(--text-xs)] font-bold tracking-wider flex items-center justify-between">
              FINAL DASHBOARD OUTPUT
            </div>
            
            <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-paper-2)]">
              <h3 className="text-[var(--text-base)] font-bold text-[var(--color-ink)]">Zero-Hallucination Layer</h3>
              <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
                Deterministic, evidence-backed action cards based directly on the math pipeline.
              </p>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              
              {optStatus !== "approved" ? (
                <div className="text-[var(--text-sm)] text-[var(--color-ink-3)] text-center py-8">
                  Run solver to generate recommendations.
                </div>
              ) : (
                <div className="animate-in fade-in duration-[var(--dur-base)] space-y-4">
                  {/* Action Card 1 */}
                  <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 bg-white">
                    <p className="text-[10px] font-bold text-[var(--color-ink-3)] uppercase tracking-wider mb-2">Validated Finding: Anomaly</p>
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)] mb-2">
                      Your continuous baseline load is higher than historical averages.
                    </p>
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-2)] flex items-start bg-[var(--color-paper-2)] p-2 rounded">
                      <CheckCircle2 className="w-3 h-3 text-[var(--color-success)] mr-1.5 mt-0.5 flex-shrink-0" />
                      Check AC/refrigeration units for maintenance. Est. saving: RM90/mo.
                    </p>
                  </div>

                  {/* Action Card 2 */}
                  <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 bg-white">
                    <p className="text-[10px] font-bold text-[var(--color-ink-3)] uppercase tracking-wider mb-2">Validated Finding: Strategy</p>
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)] mb-2">
                      Your solar energy is worth more if used directly than exported.
                    </p>
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-2)] flex items-start bg-[var(--color-paper-2)] p-2 rounded">
                      <CheckCircle2 className="w-3 h-3 text-[var(--color-success)] mr-1.5 mt-0.5 flex-shrink-0" />
                      Shift washing cycles to 1pm. Shifts 4.5 kWh/day.
                    </p>
                  </div>

                  {/* Action Card 3 */}
                  <div className="border border-[var(--color-accent)] border-opacity-30 rounded-[var(--radius-md)] p-4 bg-[#eef2ff]">
                    <p className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-wider mb-2">Validated Finding: Allocation</p>
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)] mb-2">
                      60% of surplus credit routed to Branch B to offset highest unpaid grid import.
                    </p>
                    <p className="text-[var(--text-xs)] text-[var(--color-ink-2)] flex items-start bg-white bg-opacity-60 p-2 rounded">
                      <CheckCircle2 className="w-3 h-3 text-[var(--color-accent)] mr-1.5 mt-0.5 flex-shrink-0" />
                      Branch B bill reduced by RM 120. No action required.
                    </p>
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
