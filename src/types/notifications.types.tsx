/**
 * Notification Types
 * 
 * Type definitions for notification-related data structures.
 */

// Notification types enum (mirrors backend)
export enum NotificationType {
  STAMP_COLLECTED = 'STAMP_COLLECTED',
  CARD_COMPLETED = 'CARD_COMPLETED',
  REWARD_AVAILABLE = 'REWARD_AVAILABLE',
  NEW_EVENT = 'NEW_EVENT',
  NEW_OFFER = 'NEW_OFFER',
  SYSTEM = 'SYSTEM',
  MARKETING = 'MARKETING',
}

// Single notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Notification stats
export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

// Create notification DTO
export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, unknown>;
}

// Pagination info
export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// Paginated notifications response
export interface PaginatedNotifications {
  data: Notification[];
  pagination: NotificationPagination;
}

// API Response types
export interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification;
  timestamp: string;
}

export interface NotificationsListResponse {
  success: boolean;
  message: string;
  data: Notification[];
  pagination: NotificationPagination;
  timestamp: string;
}

export interface NotificationStatsResponse {
  success: boolean;
  message: string;
  data: NotificationStats;
  timestamp: string;
}

export interface BulkNotificationResult {
  success: boolean;
  count: number;
  message: string;
}