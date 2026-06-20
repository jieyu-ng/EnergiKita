"use client";

import { useState } from "react";
import { useUser, AccountType } from "@/contexts/UserContext";
import { Building2, Home, ArrowLeft, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { setAccountType } = useUser();
  const [selectedRole, setSelectedRole] = useState<AccountType>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) return;

    if (selectedRole === "business" && (email !== "business" || password !== "business")) {
      setErrorMsg("Invalid credentials. Use 'business' for both fields.");
      return;
    }

    if (selectedRole === "individual" && (email !== "test" || password !== "test")) {
      setErrorMsg("Invalid credentials. Use 'test' for both fields.");
      return;
    }
    
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      setAccountType(selectedRole);
    }, 1000);
  };

  if (selectedRole) {
    return (
      <div className="flex flex-col items-center justify-center pt-24 pb-32 px-6 min-h-[70vh]">
        <div className="max-w-md w-full">
          
          <button 
            onClick={() => {
              setSelectedRole(null);
              setEmail("");
              setPassword("");
            }}
            className="flex items-center text-[var(--text-sm)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to roles
          </button>

          <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 shadow-sm">
            <div className="flex flex-col items-center mb-8">
              <div className={`w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center mb-4 ${selectedRole === "business" ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]" : "bg-[var(--color-success)]/10 text-[var(--color-success)]"}`}>
                {selectedRole === "business" ? <Building2 className="w-6 h-6" /> : <Home className="w-6 h-6" />}
              </div>
              <h2 className="text-[var(--text-2xl)] font-bold text-[var(--color-ink)]">
                {authMode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mt-1">
                {selectedRole === "business" ? "Business & SME Portal" : "Individual Homeowner Portal"}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Username / Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[var(--color-ink-3)]" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === "business" ? "business" : "test"} 
                    className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] pl-10 px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[var(--text-sm)] font-medium text-[var(--color-ink)]">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[var(--color-ink-3)]" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] pl-10 px-3 py-2 text-[var(--text-sm)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-[#b91c1c] bg-[#fee2e2] text-[var(--text-sm)] p-3 rounded-[var(--radius-md)] font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white px-4 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium shadow-sm disabled:opacity-70 transition-colors flex items-center justify-center ${selectedRole === "business" ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]" : "bg-[var(--color-success)] hover:bg-[#059669]"}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  authMode === "login" ? "Sign In" : "Sign Up"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center">
              <p className="text-[var(--text-sm)] text-[var(--color-ink-2)]">
                {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                  className={`ml-1.5 font-semibold hover:underline ${selectedRole === "business" ? "text-[var(--color-accent)]" : "text-[var(--color-success)]"}`}
                >
                  {authMode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-32 px-6 min-h-[70vh]">
      <div className="max-w-[var(--content-width)] w-full text-center space-y-8">
        
        <h1 className="text-[var(--text-4xl)] md:text-5xl font-bold text-[var(--color-ink)] leading-tight tracking-tight max-w-2xl mx-auto">
          Choose your account type
        </h1>
        
        <p className="text-[var(--text-lg)] text-[var(--color-ink-2)] max-w-xl mx-auto font-body">
          EnergiKita adapts its flexibility engine based on your energy profile. Select your role to continue.
        </p>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          
          <div 
            onClick={() => setSelectedRole("business")}
            className="group bg-white border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-[var(--radius-xl)] p-8 cursor-pointer transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-[var(--text-xl)] font-bold text-[var(--color-ink)] mb-2">Business & SME</h3>
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mb-6">
              Manage commercial energy flexibility, run NOVA branch allocation, and offset high-usage premises.
            </p>
            <div className="text-[var(--text-sm)] font-bold text-[var(--color-accent)] flex items-center">
              Login as Business &rarr;
            </div>
          </div>

          <div 
            onClick={() => setSelectedRole("individual")}
            className="group bg-white border border-[var(--color-border)] hover:border-[var(--color-success)] rounded-[var(--radius-xl)] p-8 cursor-pointer transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-[var(--text-xl)] font-bold text-[var(--color-ink)] mb-2">Individual Homeowner</h3>
            <p className="text-[var(--text-sm)] text-[var(--color-ink-2)] mb-6">
              Manage your household energy usage, optimise EV charging, and trade excess solar with neighbors.
            </p>
            <div className="text-[var(--text-sm)] font-bold text-[var(--color-success)] flex items-center">
              Login as Individual &rarr;
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
