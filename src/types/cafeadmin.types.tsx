/**
 * Cafe Admin Types
 * 
 * Type definitions for cafe admin dashboard and management.
 */

// Dashboard stats
export interface CafeDashboardStats {
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
  totalVisits: number;
  uniqueVisitors: number;
  completedCards: number;
  averageRating: number;
  totalReviews: number;
  currentPin: string | null;
  pinExpiresAt: string;
  cafe: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
  };
}

// PIN activity
export interface PinActivityData {
  usesToday: number;
  lastUsed: string | null;
  redemptions: number;
  recentScans: PinScan[];
}

export interface PinScan {
  id: string;
  time: string;
  action: string;
  staffMember: string;
  verified: boolean;
}

// Visitor activity
export interface VisitorActivity {
  userId: string;
  username: string;
  lastVisit: string;
  totalVisits: number;
  stampsCollected: number;
}

// Peak hours
export interface PeakHour {
  hour: number;
  count: number;
  timeLabel: string;
}

// Recent visitor
export interface RecentVisitor {
  id: string;
  userId: string;
  cafeId: string;
  collectedAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    profileImageUrl: string | null;
  };
}

// Update PIN request
export interface UpdatePinRequest {
  cafeId: string;
  newPin?: string;
}

// Update PIN response
export interface UpdatePinResponse {
  id: string;
  name: string;
  staffPin: string;
  pinUpdatedAt: string;
}

// API Responses
export interface DashboardResponse {
  success: boolean;
  data: CafeDashboardStats;
}

export interface PinActivityResponse {
  success: boolean;
  data: PinActivityData;
}

export interface UpdatePinApiResponse {
  success: boolean;
  data: UpdatePinResponse;
}

export interface PeakHoursResponse {
  success: boolean;
  data: PeakHour[];
}

export interface RecentVisitorsResponse {
  success: boolean;
  data: RecentVisitor[];
}