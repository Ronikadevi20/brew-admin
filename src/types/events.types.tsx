/**
 * Events & Offers Types
 * 
 * Type definitions for events and promotional offers.
 */

// Event types enum - must match backend EventType enum
export type EventType = 'WORKSHOP' | 'LIVE_MUSIC' | 'OPEN_MIC' | 'TASTING' | 'MEETUP' | 'SPECIAL_EVENT' | 'OTHER';

// Discount types enum - must match backend DiscountType enum
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_ONE_GET_ONE' | 'FREE_ITEM';

// ==================== Events ====================

// Create event request
export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  location?: string;
  cafeId?: string;
  imageUrl?: string;
  capacity?: number;
  metadata?: Record<string, any>;
}

// Update event request
export interface UpdateEventRequest {
  title?: string;
  description?: string;
  eventType?: EventType;
  startDate?: string;
  endDate?: string;
  location?: string;
  cafeId?: string;
  imageUrl?: string;
  capacity?: number;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

// Event response from API
export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  location?: string;
  cafeId?: string;
  imageUrl?: string;
  capacity?: number;
  registeredCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  cafe?: {
    id: string;
    name: string;
    address: string;
  };
  isRegistered?: boolean;
  isFull?: boolean;
}

// ==================== Offers ====================

// Create offer request
export interface CreateOfferRequest {
  title: string;
  description: string;
  discountType?: DiscountType;
  discountValue?: number;
  cafeId?: string;
  startDate: string;
  endDate: string;
  terms?: string;
  maxRedemptions?: number;
  code?: string;
  imageUrl?: string;
}

// Update offer request
export interface UpdateOfferRequest {
  title?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  cafeId?: string;
  startDate?: string;
  endDate?: string;
  terms?: string;
  maxRedemptions?: number;
  code?: string;
  imageUrl?: string;
  isActive?: boolean;
}

// Offer response from API
export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType?: DiscountType;
  discountValue?: number;
  cafeId?: string;
  startDate: string;
  endDate: string;
  terms?: string;
  maxRedemptions?: number;
  currentRedemptions: number;
  code?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  cafe?: {
    id: string;
    name: string;
    address: string;
  };
  isExpired?: boolean;
  isAvailable?: boolean;
}

// ==================== API Responses ====================

export interface EventsResponse {
  success: boolean;
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface OffersResponse {
  success: boolean;
  data: Offer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface SingleEventResponse {
  success: boolean;
  data: Event;
}

export interface SingleOfferResponse {
  success: boolean;
  data: Offer;
}