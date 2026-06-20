"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/passport");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center pt-16 px-6">
      <div className="max-w-[var(--content-width)] w-full max-w-2xl space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-[var(--text-3xl)] font-bold text-[var(--color-ink)] tracking-tight">
            Business Context
          </h1>
          <p className="text-[var(--text-base)] text-[var(--color-ink-2)]">
            Tell us about your operations to accurately identify your most flexible energy periods.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm p-8 space-y-8 relative">
            
            {isSubmitting && (
              <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
                <p className="text-[var(--text-sm)] font-medium text-[var(--color-ink)]">
                  Generating Profile...
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Business Type</label>
                <input 
                  type="text" 
                  defaultValue="Laundromat" 
                  className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Operating Hours</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="time" 
                    defaultValue="08:00" 
                    className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  />
                  <span className="text-[var(--text-sm)] text-[var(--color-ink-2)]">to</span>
                  <input 
                    type="time" 
                    defaultValue="22:00" 
                    className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Highest Electricity Consumption Equipment</label>
              <input 
                type="text" 
                defaultValue="Washing machines and dryers" 
                className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Flexible Activities (1-2 hour delay)</label>
              <textarea 
                defaultValue="Some washing cycles can be delayed, but customers wait for dryers" 
                rows={2}
                className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Busiest Customer Period</label>
              <div className="flex items-center space-x-2 max-w-[50%]">
                <input 
                  type="time" 
                  defaultValue="12:00" 
                  className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                />
                <span className="text-[var(--text-sm)] text-[var(--color-ink-2)]">to</span>
                <input 
                  type="time" 
                  defaultValue="14:00" 
                  className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                />
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
              Generate Passport
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
