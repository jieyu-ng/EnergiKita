"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

export default function OnboardPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/passport");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center pt-16 px-6 relative">
      {/* Background glow specific to this page */}
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-[var(--content-width)] w-full space-y-12">
        
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-[var(--dur-base)]">
          <p className="text-[var(--text-sm)] font-medium text-[var(--color-accent)] tracking-wider uppercase">Step 2</p>
          <h1 className="text-[var(--text-4xl)] font-display text-[var(--color-ink)]">
            Business Context
          </h1>
          <p className="text-[var(--text-lg)] text-[var(--color-ink-2)] max-w-xl mx-auto">
            Tell KitaAI about your operations so it can accurately identify your most flexible energy periods.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-[var(--dur-base)] delay-100">
          <div className="bg-[var(--glass-bg)] backdrop-blur-2xl rounded-[var(--radius-2xl)] border border-[var(--glass-border)] shadow-[var(--glass-shadow)] p-8 md:p-12 space-y-8 relative overflow-hidden">
            
            {isSubmitting && (
              <div className="absolute inset-0 z-10 bg-[var(--color-paper)]/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-[var(--dur-fast)]">
                <div className="w-12 h-12 border-4 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(var(--color-accent),0.3)]"></div>
                <p className="text-[var(--text-xl)] font-display text-[var(--color-ink)] flex items-center">
                  <Sparkles className="w-5 h-5 mr-3 text-[var(--color-accent)] animate-pulse" />
                  Generating Passport...
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)] tracking-wide">What type of business do you operate?</label>
                <input 
                  type="text" 
                  defaultValue="Laundromat" 
                  className="w-full bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] px-5 py-4 text-[var(--color-ink)] font-medium focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all hover:bg-[var(--color-paper)] shadow-sm"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)] tracking-wide">What are your normal operating hours?</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="time" 
                    defaultValue="08:00" 
                    className="w-full bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] px-5 py-4 text-[var(--color-ink)] font-medium focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all hover:bg-[var(--color-paper)] shadow-sm"
                  />
                  <span className="text-[var(--color-ink-3)] font-medium">to</span>
                  <input 
                    type="time" 
                    defaultValue="22:00" 
                    className="w-full bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] px-5 py-4 text-[var(--color-ink)] font-medium focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all hover:bg-[var(--color-paper)] shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)] tracking-wide">Which equipment uses the most electricity?</label>
              <input 
                type="text" 
                defaultValue="Washing machines and dryers" 
                className="w-full bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] px-5 py-4 text-[var(--color-ink)] font-medium focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all hover:bg-[var(--color-paper)] shadow-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)] tracking-wide">Which activities could be delayed by 1-2 hours?</label>
              <textarea 
                defaultValue="Some washing cycles can be delayed, but customers wait for dryers" 
                rows={2}
                className="w-full bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] px-5 py-4 text-[var(--color-ink)] font-medium focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all hover:bg-[var(--color-paper)] shadow-sm resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)] tracking-wide">When is your busiest customer period?</label>
              <div className="flex items-center space-x-4 max-w-md">
                <input 
                  type="time" 
                  defaultValue="12:00" 
                  className="w-full bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] px-5 py-4 text-[var(--color-ink)] font-medium focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all hover:bg-[var(--color-paper)] shadow-sm"
                />
                <span className="text-[var(--color-ink-3)] font-medium">to</span>
                <input 
                  type="time" 
                  defaultValue="14:00" 
                  className="w-full bg-[var(--color-paper)]/50 border border-[var(--color-border)] rounded-[var(--radius-lg)] px-5 py-4 text-[var(--color-ink)] font-medium focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all hover:bg-[var(--color-paper)] shadow-sm"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center pt-6">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="text-[var(--color-ink-2)] hover:text-[var(--color-ink)] font-medium transition-colors"
            >
              Back
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center bg-[var(--color-ink)] text-white px-8 py-4 rounded-full font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-[var(--dur-base)]"
            >
              Generate Passport <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
