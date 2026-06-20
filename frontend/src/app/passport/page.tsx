"use client";

import Link from "next/link";
import { BatteryCharging, Sun, Zap, Check, AlertCircle } from "lucide-react";

export default function PassportPage() {
  return (
    <div className="max-w-[var(--page-width)] mx-auto px-6 pt-12 pb-24">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Profile Details */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div>
            <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)] leading-tight">
              Aisyah Laundry Services
            </h1>
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
              aisyah.laundry@example.com
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
              <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Confidence</p>
              <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-ink-2)] bg-[var(--color-paper-3)] px-2 py-0.5 rounded">
                76%
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-[var(--text-sm)] font-bold text-[var(--color-ink)] mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-[var(--color-ink-3)]" />
              Details
            </h3>
            <ul className="text-[var(--text-sm)] text-[var(--color-ink-2)] space-y-2">
              <li><strong>Type:</strong> Laundromat</li>
              <li><strong>Hours:</strong> 08:00 - 22:00</li>
              <li><strong>Peak:</strong> 12:00 - 14:00</li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* Tabs */}
          <div className="flex border-b border-[var(--color-border)] mb-6">
            <button className="px-4 py-2 text-[var(--text-sm)] font-medium text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] -mb-px">
              Overview
            </button>
          </div>

          <div className="space-y-10">
            {/* Section: Subscriptions / Flexibility Assets */}
            <section>
              <h2 className="text-[var(--text-base)] font-bold text-[var(--color-ink)] mb-4">Flexibility Assets</h2>
              
              <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden bg-white">
                <table className="w-full text-left text-[var(--text-sm)]">
                  <thead className="bg-[var(--color-paper-2)] border-b border-[var(--color-border)]">
                    <tr>
                      <th className="px-4 py-3 font-medium text-[var(--color-ink-2)]">ASSET</th>
                      <th className="px-4 py-3 font-medium text-[var(--color-ink-2)]">CAPACITY</th>
                      <th className="px-4 py-3 font-medium text-[var(--color-ink-2)]">SHIFT WINDOW</th>
                      <th className="px-4 py-3 font-medium text-[var(--color-ink-2)]">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    <tr>
                      <td className="px-4 py-3 text-[var(--color-ink)] font-medium">Washing Cycles</td>
                      <td className="px-4 py-3 text-[var(--color-ink-2)]">15-25 kWh</td>
                      <td className="px-4 py-3 text-[var(--color-ink-2)]">11:00 – 16:00</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-success)] bg-[var(--color-success-bg)] px-2 py-0.5 rounded">
                          <Check className="w-3 h-3 mr-1" /> Available
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-[var(--color-ink)] font-medium">Dryers</td>
                      <td className="px-4 py-3 text-[var(--color-ink-2)]">10 kWh</td>
                      <td className="px-4 py-3 text-[var(--color-ink-2)]">None</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center text-[var(--text-xs)] font-medium text-[var(--color-error)] bg-[var(--color-error-bg)] px-2 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3 mr-1" /> Fixed Load
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section: Impact Summary */}
            <section>
              <h2 className="text-[var(--text-base)] font-bold text-[var(--color-ink)] mb-4">Impact Summary</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-6 bg-white">
                  <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-1">Estimated Savings</p>
                  <p className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)]">RM 180 - 260 <span className="text-[var(--text-sm)] font-normal text-[var(--color-ink-3)]">/mo</span></p>
                </div>
                
                <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-6 bg-white flex flex-col justify-center">
                  <p className="text-[var(--text-xs)] text-[var(--color-ink-3)] font-medium uppercase tracking-wider mb-2">Solar Alignment</p>
                  <div className="flex items-center text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                    <Sun className="w-4 h-4 mr-2 text-[var(--color-accent)]" /> 
                    Strong Match (11:00 - 16:00)
                  </div>
                </div>
              </div>
            </section>
            
            <div className="pt-4">
              <Link href="/community">
                <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm transition-colors">
                  Simulate Plan
                </button>
              </Link>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
