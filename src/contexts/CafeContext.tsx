import { useState, createContext, useContext, ReactNode, useCallback } from "react";

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface CafeProfile {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  address: string;
  area: string;
  phone: string;
  email: string;
  instagram: string;
  website: string;
  operatingHours: OperatingHours[];
  verificationMethod: "pin" | "qr_only";
  staffPin: string;
  subscriptionStatus: "none" | "pending" | "active" | "cancelled";
  onboardingComplete: boolean;
  onboardingStep: number;
  termsAccepted: boolean;
  antifraudAccepted: boolean;
}

const defaultOperatingHours: OperatingHours[] = [
  { day: "Monday", open: "08:00", close: "22:00", isClosed: false },
  { day: "Tuesday", open: "08:00", close: "22:00", isClosed: false },
  { day: "Wednesday", open: "08:00", close: "22:00", isClosed: false },
  { day: "Thursday", open: "08:00", close: "22:00", isClosed: false },
  { day: "Friday", open: "08:00", close: "23:00", isClosed: false },
  { day: "Saturday", open: "09:00", close: "23:00", isClosed: false },
  { day: "Sunday", open: "09:00", close: "21:00", isClosed: false },
];

const defaultCafeProfile: CafeProfile = {
  id: "",
  name: "",
  logo: null,
  description: "",
  address: "",
  area: "",
  phone: "",
  email: "",
  instagram: "",
  website: "",
  operatingHours: defaultOperatingHours,
  verificationMethod: "pin",
  staffPin: "",
  subscriptionStatus: "none",
  onboardingComplete: false,
  onboardingStep: 1,
  termsAccepted: false,
  antifraudAccepted: false,
};

interface CafeContextType {
  cafe: CafeProfile;
  updateCafe: (updates: Partial<CafeProfile>) => void;
  saveDraft: () => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
  isLoading: boolean;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export function CafeProvider({ children }: { children: ReactNode }) {
  const [cafe, setCafe] = useState<CafeProfile>(() => {
    // Load from localStorage for persistence
    const saved = localStorage.getItem("cafe_profile");
    if (saved) {
      try {
        return { ...defaultCafeProfile, ...JSON.parse(saved) };
      } catch {
        return defaultCafeProfile;
      }
    }
    return defaultCafeProfile;
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateCafe = useCallback((updates: Partial<CafeProfile>) => {
    setCafe((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("cafe_profile", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveDraft = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would be PATCH /api/cafes/me
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem("cafe_profile", JSON.stringify(cafe));
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cafe]);

  const completeOnboarding = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updated = { ...cafe, onboardingComplete: true };
      setCafe(updated);
      localStorage.setItem("cafe_profile", JSON.stringify(updated));
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cafe]);

  return (
    <CafeContext.Provider
      value={{ cafe, updateCafe, saveDraft, completeOnboarding, isLoading }}
    >
      {children}
    </CafeContext.Provider>
  );
}

export function useCafe() {
  const context = useContext(CafeContext);
  if (context === undefined) {
    throw new Error("useCafe must be used within a CafeProvider");
  }
  return context;
}
