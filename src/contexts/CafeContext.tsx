/**
 * Cafe Context
 * 
 * Provides cafe state and methods throughout the application.
 * Handles cafe profile, onboarding, and draft persistence.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import { cafeService } from '@/services/cafe.service';
import { useAuth } from '@/contexts/AuthContext';
import type {
  CafeProfile,
  CafeContextType,
  Cafe,
} from '@/types/cafe.types';
import { defaultCafeProfile } from '@/types/cafe.types';

// Storage key for draft persistence
const CAFE_DRAFT_KEY = 'cafe_profile_draft';

// Create context
const CafeContext = createContext<CafeContextType | undefined>(undefined);

interface CafeProviderProps {
  children: ReactNode;
}

/**
 * Load draft from sessionStorage (more secure than localStorage)
 */
function loadDraft(): CafeProfile | null {
  try {
    const saved = sessionStorage.getItem(CAFE_DRAFT_KEY);
    if (saved) {
      return { ...defaultCafeProfile, ...JSON.parse(saved) };
    }
  } catch {
    console.warn('Failed to load cafe draft');
  }
  return null;
}

/**
 * Save draft to sessionStorage
 */
function saveDraftToStorage(profile: CafeProfile): void {
  try {
    sessionStorage.setItem(CAFE_DRAFT_KEY, JSON.stringify(profile));
  } catch {
    console.warn('Failed to save cafe draft');
  }
}

/**
 * Clear draft from storage
 */
function clearDraftFromStorage(): void {
  try {
    sessionStorage.removeItem(CAFE_DRAFT_KEY);
  } catch {
    console.warn('Failed to clear cafe draft');
  }
}

export function CafeProvider({ children }: CafeProviderProps) {
  const { user, refreshAuth } = useAuth();
  
  // Initialize cafe profile from draft or defaults
  const [cafe, setCafe] = useState<CafeProfile>(() => {
    return loadDraft() || defaultCafeProfile;
  });
  
  const [myCafe, setMyCafe] = useState<Cafe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Update cafe profile and persist draft
   */
  const updateCafe = useCallback((updates: Partial<CafeProfile>) => {
    setCafe((prev) => {
      const updated = { ...prev, ...updates };
      saveDraftToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Save draft (explicit action)
   */
  const saveDraft = useCallback(async (): Promise<boolean> => {
    try {
      saveDraftToStorage(cafe);
      return true;
    } catch {
      return false;
    }
  }, [cafe]);

  /**
   * Create cafe via API (completes onboarding)
   */
  const createCafe = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const createdCafe = await cafeService.create(cafe);
      
      setMyCafe(createdCafe);
      
      // Update local state
      setCafe((prev) => ({
        ...prev,
        id: createdCafe.id,
        onboardingComplete: true,
      }));
      
      // Clear draft after successful creation
      clearDraftFromStorage();
      
      // Refresh auth to update hasCompletedOnboarding
      await refreshAuth();
      
      return true;
    } catch (error: any) {
      console.error('Failed to create cafe:', error);
      
      // Log detailed error for debugging
      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
      }
      
      // Re-throw the error so the UI can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cafe, refreshAuth]);

  /**
   * Load user's cafe from API
   */
  const loadMyCafe = useCallback(async (): Promise<void> => {
    if (!user || !user.hasCompletedOnboarding) {
      setIsInitialized(true);
      return;
    }

    // Skip if already loaded
    if (myCafe) {
      setIsInitialized(true);
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Loading my cafe from API...');
      const cafeData = await cafeService.getMyCafe();
      console.log('Loaded cafe:', cafeData);
      
      setMyCafe(cafeData);
      
      // Also update local profile state with cafe data
      setCafe((prev) => ({
        ...prev,
        id: cafeData.id,
        name: cafeData.name,
        logo: cafeData.imageUrl || null,
        description: cafeData.description || '',
        address: cafeData.address,
        city: cafeData.city,
        phone: cafeData.phone || '',
        email: cafeData.email || '',
        instagram: cafeData.instagram || '',
        website: cafeData.website || '',
        verificationMethod: (cafeData.verificationMethod as 'pin' | 'qr_only') || 'pin',
        onboardingComplete: true,
      }));
      
      setIsInitialized(true);
    } catch (error: any) {
      console.error('Failed to load cafe:', error);
      // If cafe not found, user might not have completed onboarding properly
      if (error.response?.status === 404) {
        console.warn('No cafe found for user');
      }
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.hasCompletedOnboarding, myCafe]);

  /**
   * Complete onboarding (wrapper around createCafe)
   */
  const completeOnboarding = useCallback(async (): Promise<boolean> => {
    return createCafe();
  }, [createCafe]);

  /**
   * Reset cafe to defaults
   */
  const resetCafe = useCallback(() => {
    setCafe(defaultCafeProfile);
    setMyCafe(null);
    clearDraftFromStorage();
  }, []);

  /**
   * Initialize on mount and when user changes
   */
  useEffect(() => {
    // Only run when user state changes
    if (user && user.hasCompletedOnboarding && !myCafe && !isLoading) {
      loadMyCafe();
    } else if (!user) {
      setMyCafe(null);
      setIsInitialized(true);
    } else if (user && !user.hasCompletedOnboarding) {
      setIsInitialized(true);
    }
  }, [user?.id, user?.hasCompletedOnboarding]);

  // Memoize context value
  const value = useMemo<CafeContextType>(
    () => ({
      cafe,
      myCafe,
      isLoading,
      isInitialized,
      updateCafe,
      saveDraft,
      createCafe,
      loadMyCafe,
      completeOnboarding,
      resetCafe,
    }),
    [
      cafe,
      myCafe,
      isLoading,
      isInitialized,
      updateCafe,
      saveDraft,
      createCafe,
      loadMyCafe,
      completeOnboarding,
      resetCafe,
    ]
  );

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
}

/**
 * Hook to access cafe context
 */
export function useCafe(): CafeContextType {
  const context = useContext(CafeContext);
  
  if (context === undefined) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  
  return context;
}

export default CafeContext;