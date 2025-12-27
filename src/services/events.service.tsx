/**
 * Events & Offers Service
 * 
 * Handles all events and offers API calls.
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Event,
  Offer,
  CreateEventRequest,
  UpdateEventRequest,
  CreateOfferRequest,
  UpdateOfferRequest,
  EventsResponse,
  OffersResponse,
  SingleEventResponse,
  SingleOfferResponse,
} from '@/types/events.types';

/**
 * Events service
 */
export const eventsService = {
  /**
   * Get all events
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    eventType?: string;
    cafeId?: string;
    isActive?: boolean;
    upcoming?: boolean;
  }): Promise<EventsResponse> => {
    const response = await apiClient.get<EventsResponse>(
      API_ENDPOINTS.EVENTS.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Get upcoming events
   */
  getUpcoming: async (page: number = 1, limit: number = 20): Promise<EventsResponse> => {
    const response = await apiClient.get<EventsResponse>(
      API_ENDPOINTS.EVENTS.UPCOMING,
      { params: { page, limit } }
    );
    return response.data;
  },

  /**
   * Get events by cafe
   */
  getByCafe: async (cafeId: string, page: number = 1, limit: number = 20): Promise<EventsResponse> => {
    const response = await apiClient.get<EventsResponse>(
      API_ENDPOINTS.EVENTS.BY_CAFE(cafeId),
      { params: { page, limit } }
    );
    return response.data;
  },

  /**
   * Get event by ID
   */
  getById: async (id: string): Promise<Event> => {
    const response = await apiClient.get<SingleEventResponse>(
      API_ENDPOINTS.EVENTS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Create event
   */
  create: async (data: CreateEventRequest): Promise<Event> => {
    const response = await apiClient.post<SingleEventResponse>(
      API_ENDPOINTS.EVENTS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update event
   */
  update: async (id: string, data: UpdateEventRequest): Promise<Event> => {
    const response = await apiClient.put<SingleEventResponse>(
      API_ENDPOINTS.EVENTS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete event
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.EVENTS.BY_ID(id));
  },

  /**
   * Register for event
   */
  register: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; data: { success: boolean; message: string } }>(
      API_ENDPOINTS.EVENTS.REGISTER(id)
    );
    return response.data.data;
  },

  /**
   * Unregister from event
   */
  unregister: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; data: { success: boolean; message: string } }>(
      API_ENDPOINTS.EVENTS.UNREGISTER(id)
    );
    return response.data.data;
  },
};

/**
 * Offers service
 */
export const offersService = {
  /**
   * Get all offers
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    cafeId?: string;
    isActive?: boolean;
    available?: boolean;
  }): Promise<OffersResponse> => {
    const response = await apiClient.get<OffersResponse>(
      API_ENDPOINTS.OFFERS.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Get active offers
   */
  getActive: async (page: number = 1, limit: number = 20): Promise<OffersResponse> => {
    const response = await apiClient.get<OffersResponse>(
      API_ENDPOINTS.OFFERS.ACTIVE,
      { params: { page, limit } }
    );
    return response.data;
  },

  /**
   * Get offers by cafe
   */
  getByCafe: async (cafeId: string, page: number = 1, limit: number = 20): Promise<OffersResponse> => {
    const response = await apiClient.get<OffersResponse>(
      API_ENDPOINTS.OFFERS.BY_CAFE(cafeId),
      { params: { page, limit } }
    );
    return response.data;
  },

  /**
   * Get offer by ID
   */
  getById: async (id: string): Promise<Offer> => {
    const response = await apiClient.get<SingleOfferResponse>(
      API_ENDPOINTS.OFFERS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Get offer by code
   */
  getByCode: async (code: string): Promise<Offer> => {
    const response = await apiClient.get<SingleOfferResponse>(
      API_ENDPOINTS.OFFERS.BY_CODE(code)
    );
    return response.data.data;
  },

  /**
   * Create offer
   */
  create: async (data: CreateOfferRequest): Promise<Offer> => {
    const response = await apiClient.post<SingleOfferResponse>(
      API_ENDPOINTS.OFFERS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update offer
   */
  update: async (id: string, data: UpdateOfferRequest): Promise<Offer> => {
    const response = await apiClient.put<SingleOfferResponse>(
      API_ENDPOINTS.OFFERS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete offer
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.OFFERS.BY_ID(id));
  },

  /**
   * Redeem offer
   */
  redeem: async (idOrCode: string): Promise<{ success: boolean; message: string; offer: Offer }> => {
    const response = await apiClient.post<{ success: boolean; data: { success: boolean; message: string; offer: Offer } }>(
      API_ENDPOINTS.OFFERS.REDEEM(idOrCode)
    );
    return response.data.data;
  },
};

export default { eventsService, offersService };