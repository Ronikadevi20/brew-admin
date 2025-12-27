import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Notification,
  NotificationStats,
  PaginatedNotifications,
  NotificationResponse,
  NotificationsListResponse,
  NotificationStatsResponse,
  CreateNotificationDTO,
  BulkNotificationResult,
  NotificationType,
} from '@/types/notifications.types';

/**
 * Notifications service object containing all notification methods
 */
export const notificationsService = {
  /**
   * Get user notifications
   */
  getNotifications: async (
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginatedNotifications> => {
    const response = await apiClient.get<NotificationsListResponse>(
      API_ENDPOINTS.NOTIFICATIONS.BASE,
      { params: { page, limit, unreadOnly } }
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  /**
   * Get notification by ID
   */
  getById: async (id: string): Promise<Notification> => {
    const response = await apiClient.get<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Get notification statistics
   */
  getStats: async (): Promise<NotificationStats> => {
    const response = await apiClient.get<NotificationStatsResponse>(
      API_ENDPOINTS.NOTIFICATIONS.STATS
    );
    return response.data.data;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    );
    return response.data.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.patch<{ success: boolean; message: string; data: { success: boolean; message: string } }>(
      API_ENDPOINTS.NOTIFICATIONS.READ_ALL
    );
    return response.data.data;
  },

  /**
   * Delete notification
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
  },

  /**
   * Delete all notifications
   */
  deleteAll: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data: { success: boolean; message: string } }>(
      API_ENDPOINTS.NOTIFICATIONS.BASE
    );
    return response.data.data;
  },

  /**
   * Create notification (admin only)
   */
  create: async (data: CreateNotificationDTO): Promise<Notification> => {
    const response = await apiClient.post<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Send bulk notifications (admin only)
   */
  sendBulk: async (
    userIds: string[],
    title: string,
    message: string,
    type: NotificationType
  ): Promise<BulkNotificationResult> => {
    const response = await apiClient.post<{ success: boolean; data: BulkNotificationResult }>(
      API_ENDPOINTS.NOTIFICATIONS.BULK,
      { userIds, title, message, type }
    );
    return response.data.data;
  },
};

export default notificationsService;