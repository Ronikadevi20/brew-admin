/**
 * Cafe Types
 * 
 * Type definitions for cafe-related data structures.
 */

// Operating hours for a single day
export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

// Opening hours format from API (key-value pairs)
export interface OpeningHoursMap {
  [key: string]: string;
}

// Cafe stats
export interface CafeStats {
  totalStamps: number;
  totalReviews: number;
  averageRating: number;
  completedCards: number;
  uniqueVisitors: number;
}

// Cafe data from API
export interface Cafe {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  qrCode: string;
  verificationMethod: 'pin' | 'qr_only';
  staffPin?: string | null;
  imageUrl?: string | null;
  instagram?: string | null;
  website?: string | null;
  amenities?: string[] | null;
  openingHours?: OperatingHours[] | OpeningHoursMap | null;
  isActive: boolean;
  distance?: number;
  isSaved?: boolean;
  stats?: {
    totalVisits: number;
    averageRating: number;
    totalReviews: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Local cafe profile state (for onboarding/editing)
export interface CafeProfile {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  address: string;
  city: string;
  area: string;
  phone: string;
  email: string;
  instagram: string;
  website: string;
  operatingHours: OperatingHours[];
  verificationMethod: 'pin' | 'qr_only';
  staffPin: string;
  subscriptionStatus: 'none' | 'pending' | 'active' | 'cancelled';
  onboardingComplete: boolean;
  onboardingStep: number;
  termsAccepted: boolean;
  antifraudAccepted: boolean;
}

// Create cafe request payload - matches backend CreateCafeDTO
export interface CreateCafeRequest {
  name: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  imageUrl?: string | null;  // Can be base64 or URL - backend handles conversion
  verificationMethod: 'pin' | 'qr_only';
  staffPin?: string | null;
  amenities?: string[] | null;
  openingHours?: OperatingHours[] | null;
  instagram?: string | null;
  website?: string | null;
}

// Update cafe request payload - matches backend UpdateCafeDTO
export interface UpdateCafeRequest {
  name?: string;
  address?: string;
  city?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  verificationMethod?: 'pin' | 'qr_only';
  staffPin?: string | null;
  amenities?: string[] | null;
  openingHours?: OperatingHours[] | null;
  instagram?: string | null;
  website?: string | null;
  isActive?: boolean;
}

// Create cafe response
export interface CreateCafeResponse {
  success: boolean;
  message: string;
  data: Cafe;
  timestamp: string;
}

// Get cafe response
export interface GetCafeResponse {
  success: boolean;
  message: string;
  data: Cafe;
  timestamp: string;
}

// Get cafe stats response
export interface GetCafeStatsResponse {
  success: boolean;
  message: string;
  data: CafeStats;
  timestamp: string;
}

// Pagination info
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// Search cafes response
export interface SearchCafesResponse {
  success: boolean;
  data: Cafe[];
  pagination: Pagination;
}

// Cafe context state
export interface CafeState {
  cafe: CafeProfile;
  myCafe: Cafe | null;
  isLoading: boolean;
  isInitialized: boolean;
}

// Cafe context actions
export interface CafeContextType extends CafeState {
  updateCafe: (updates: Partial<CafeProfile>) => void;
  saveDraft: () => Promise<boolean>;
  createCafe: () => Promise<boolean>;
  loadMyCafe: () => Promise<void>;
  completeOnboarding: () => Promise<boolean>;
  resetCafe: () => void;
}

// Default operating hours
export const defaultOperatingHours: OperatingHours[] = [
  { day: 'Monday', open: '08:00', close: '22:00', isClosed: false },
  { day: 'Tuesday', open: '08:00', close: '22:00', isClosed: false },
  { day: 'Wednesday', open: '08:00', close: '22:00', isClosed: false },
  { day: 'Thursday', open: '08:00', close: '22:00', isClosed: false },
  { day: 'Friday', open: '08:00', close: '23:00', isClosed: false },
  { day: 'Saturday', open: '09:00', close: '23:00', isClosed: false },
  { day: 'Sunday', open: '09:00', close: '21:00', isClosed: false },
];

// Default cafe profile
export const defaultCafeProfile: CafeProfile = {
  id: '',
  name: '',
  logo: null,
  description: '',
  address: '',
  city: 'Karachi',
  area: '',
  phone: '',
  email: '',
  instagram: '',
  website: '',
  operatingHours: defaultOperatingHours,
  verificationMethod: 'pin',
  staffPin: '',
  subscriptionStatus: 'none',
  onboardingComplete: false,
  onboardingStep: 1,
  termsAccepted: false,
  antifraudAccepted: false,
};