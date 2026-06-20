"use client";

import Link from "next/link";
import { Zap, ArrowLeft, ArrowRight, BatteryCharging, Coins, RefreshCw, HandCoins, Users } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="max-w-[var(--page-width)] mx-auto px-6 pt-12 pb-24 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/passport" className="text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-[var(--text-3xl)] font-bold text-[var(--color-ink)] tracking-tight">
          Energy Credit Wallet
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Education / Steps 1 & 2 */}
        <div className="lg:col-span-1 space-y-8">
          
          <section className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 text-[var(--color-accent)] mr-2" />
              <h2 className="text-[var(--text-lg)] font-bold text-[var(--color-ink)]">Step 1: Define Surplus</h2>
            </div>
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mb-4">
              Surplus is the flexible energy not needed for your business operations. You cannot sell raw bill usage.
            </p>
            
            <div className="bg-[var(--color-paper-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 space-y-3">
              <p className="text-[var(--text-xs)] font-bold text-[var(--color-ink-3)] uppercase tracking-wider mb-2">Example Logic</p>
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-[var(--color-ink-2)]">Base Usage:</span>
                <span className="font-medium text-[var(--color-ink)]">100 kWh/day</span>
              </div>
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-[var(--color-ink-2)]">Flexible Load:</span>
                <span className="font-medium text-[var(--color-ink)]">30 kWh</span>
              </div>
              <div className="flex justify-between text-[var(--text-sm)] text-[var(--color-error)]">
                <span>Must Stay (Constraint):</span>
                <span className="font-medium">- 10 kWh</span>
              </div>
              <div className="pt-2 border-t border-[var(--color-border)] flex justify-between text-[var(--text-sm)] font-bold text-[var(--color-success)]">
                <span>🟢 Surplus Exported:</span>
                <span>20 kWh</span>
              </div>
            </div>
          </section>

          <section className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Coins className="w-5 h-5 text-[var(--color-accent)] mr-2" />
              <h2 className="text-[var(--text-lg)] font-bold text-[var(--color-ink)]">Step 2: Pricing Logic</h2>
            </div>
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mb-4">
              Your surplus is converted using the Virtual Energy Credit Price (VECP).
            </p>
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[var(--radius-md)] p-4 text-center">
              <span className="block text-[var(--text-xs)] font-bold text-[#1d4ed8] uppercase tracking-wider mb-1">Current VECP Rate</span>
              <span className="text-[var(--text-2xl)] font-black text-[#1e3a8a]">1 Credit / kWh</span>
            </div>
          </section>

        </div>

        {/* Right Column: The Actual Wallet / Step 3 */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-[var(--color-ink)] text-white rounded-[var(--radius-lg)] p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BatteryCharging className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h2 className="text-[var(--text-sm)] font-medium text-white/70 uppercase tracking-wider mb-2">Energy Credit Statement</h2>
              <div className="flex items-baseline">
                <span className="text-[var(--text-5xl)] font-bold tracking-tight">20</span>
                <span className="text-[var(--text-base)] text-white/70 ml-2">Credits Earned Today</span>
              </div>
              <p className="text-[var(--text-sm)] text-white/50 mt-2">Generated from your 20 kWh surplus export</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[var(--text-lg)] font-bold text-[var(--color-ink)] mb-4">Redemption Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Option 1 */}
              <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-sm hover:border-[var(--color-success)] transition-colors cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center text-[var(--color-success)] group-hover:bg-[var(--color-success)] group-hover:text-white transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[var(--text-xs)] font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-1 rounded">10 Credits</span>
                  </div>
                  <h4 className="font-bold text-[var(--text-base)] text-[var(--color-ink)] mb-2">Redeem 10 kWh</h4>
                  <p className="text-[var(--text-sm)] text-[var(--color-ink-2)]">Directly offset 10 kWh of usage from your next month's energy bill.</p>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-sm hover:border-[var(--color-accent)] transition-colors cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[var(--text-xs)] font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-1 rounded">25 Credits</span>
                  </div>
                  <h4 className="font-bold text-[var(--text-base)] text-[var(--color-ink)] mb-2">Redeem 30 kWh</h4>
                  <p className="text-[var(--text-sm)] text-[var(--color-ink-2)]">Directly offset 30 kWh of usage from your next month's energy bill.</p>
                </div>
              </div>

              {/* Option 3 */}
              <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-sm hover:border-[#8b5cf6] transition-colors cursor-pointer group relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-[#8b5cf6] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-bl-md">Best Value</div>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-[#8b5cf6]/10 rounded-full flex items-center justify-center text-[#8b5cf6] group-hover:bg-[#8b5cf6] group-hover:text-white transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[var(--text-xs)] font-bold text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-1 rounded mt-1 mr-4">50 Credits</span>
                  </div>
                  <h4 className="font-bold text-[var(--text-base)] text-[var(--color-ink)] mb-2">Redeem 60 kWh</h4>
                  <p className="text-[var(--text-sm)] text-[var(--color-ink-2)]">Directly offset 60 kWh of usage from your next month's energy bill.</p>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
