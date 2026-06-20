"use client";

import Link from "next/link";
import { Sun, ArrowRight, Zap, Target, Box, RefreshCw } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function PassportPage() {
  const { accountType } = useUser();
  return (
    <div className="max-w-[var(--page-width)] mx-auto px-6 pt-12 pb-24">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Profile Details */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div>
            <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)] leading-tight">
              Aisyah Laundry
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
        <div className="flex-1">
          
          <div className="flex border-b border-[var(--color-border)] mb-6">
            <button className="px-4 py-2 text-[var(--text-sm)] font-medium text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] -mb-px">
              Solar Credit Trader Strategies
            </button>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-[var(--text-base)] font-bold text-[var(--color-ink)] mb-4">Available Strategies for Surplus Solar</h2>
              <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mb-6">
                The Solar Credit Trader has evaluated 4 strategies for your remaining 8.3 kWh surplus generation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="border border-[var(--color-accent)] rounded-[var(--radius-md)] p-5 bg-white shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[var(--color-accent)] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-bl-md">Optimal</div>
                  <div>
                    <div className="flex items-center mb-2">
                      <RefreshCw className="w-5 h-5 text-[var(--color-accent)] mr-2" />
                      <h3 className="font-bold text-[var(--text-sm)] text-[var(--color-ink)]">1. Shift Equipment</h3>
                    </div>
                    <p className="text-[var(--text-sm)] text-[var(--color-ink-2)]">
                      Move flexible washing cycles into peak solar hours (11am - 2pm).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                    <span className="text-[var(--text-xs)] font-medium text-[var(--color-ink-3)] uppercase tracking-wider">Result:</span>
                    <p className="text-[var(--text-sm)] font-bold text-[var(--color-accent)] mt-1">Absorbs 4.5 kWh surplus / day</p>
                  </div>
                </div>

                <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <Zap className="w-5 h-5 text-[var(--color-success)] mr-2" />
                      <h3 className="font-bold text-[var(--text-sm)] text-[var(--color-ink)]">2. Export Surplus</h3>
                    </div>
                    <p className="text-[var(--text-sm)] text-[var(--color-ink-2)]">
                      Export the remaining inflexible surplus back to the TNB grid.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                    <span className="text-[var(--text-xs)] font-medium text-[var(--color-ink-3)] uppercase tracking-wider">Result:</span>
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)] mt-1">Earns RM 0.25/kWh export credit</p>
                  </div>
                </div>

                {accountType === "business" && (
                  <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-5 bg-[var(--color-paper-2)] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <Box className="w-5 h-5 text-[var(--color-ink-2)] mr-2" />
                        <h3 className="font-bold text-[var(--text-sm)] text-[var(--color-ink)]">3. Virtual Allocation (NOVA)</h3>
                      </div>
                      <p className="text-[var(--text-sm)] text-[var(--color-ink-2)]">
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
            </section>
            
            <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
              <div className="text-[var(--text-sm)] text-[var(--color-ink-2)]">
                Pass these strategies to the Optimisation Engine to build the final schedule.
              </div>
              <Link href="/community">
                <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm transition-colors flex items-center">
                  Run Optimisation Engine <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
