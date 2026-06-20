"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

export type AccountType = "business" | "individual" | null;

interface UserContextType {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountTypeState] = useState<AccountType>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("ek_account_type");
    if (stored === "business" || stored === "individual") {
      setAccountTypeState(stored);
    } else if (pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  const setAccountType = (type: AccountType) => {
    setAccountTypeState(type);
    if (type) {
      localStorage.setItem("ek_account_type", type);
      router.push("/");
    } else {
      localStorage.removeItem("ek_account_type");
      router.push("/login");
    }
  };

  const logout = () => {
    setAccountType(null);
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <UserContext.Provider value={{ accountType, setAccountType, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
