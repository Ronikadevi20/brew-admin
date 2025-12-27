import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Cafe,
  CafeProfile,
  CafeStats,
  CreateCafeRequest,
  CreateCafeResponse,
  GetCafeResponse,
  GetCafeStatsResponse,
  SearchCafesResponse,
  UpdateCafeRequest,
} from '@/types/cafe.types';

/**
 * Convert CafeProfile to CreateCafeRequest
 * Matches the backend CreateCafeDTO structure
 */
function profileToCreateRequest(profile: CafeProfile): CreateCafeRequest {
  // Filter out closed days and keep operating hours as array
  const openDays = profile.operatingHours.filter(h => !h.isClosed);
  
  const request: CreateCafeRequest = {
    // Required fields
    name: profile.name,
    address: profile.address,
    city: profile.city || 'Karachi',
    verificationMethod: profile.verificationMethod,
    
    // Optional fields - send null if empty
    phone: profile.phone || null,
    email: profile.email || null,
    description: profile.description || null,
    
    // Image - send base64 directly, backend will handle conversion
    imageUrl: profile.logo || null,
    
    // Staff PIN - only send if verification method is 'pin'
    staffPin: profile.verificationMethod === 'pin' ? (profile.staffPin || null) : null,
    
    // Social links
    instagram: profile.instagram || null,
    website: profile.website || null,
    
    // Operating hours as array (backend expects array format)
    openingHours: openDays.length > 0 ? openDays : null,
    
    // Amenities - empty array for now
    amenities: [],
    
    // Coordinates - optional, send null (backend handles this)
    latitude: null,
    longitude: null,
  };

  return request;
}

/**
 * Cafe service object containing all cafe methods
 */
export const cafeService = {
  /**
   * Create a new cafe (completes onboarding)
   */
  create: async (profile: CafeProfile): Promise<Cafe> => {
    const requestData = profileToCreateRequest(profile);
    
    // Log for debugging (without full base64 string)
    console.log('Creating cafe with data:', {
      ...requestData,
      imageUrl: requestData.imageUrl ? `[base64 image - ${requestData.imageUrl.length} chars]` : null,
    });
    
    const response = await apiClient.post<CreateCafeResponse>(
      API_ENDPOINTS.CAFES.BASE,
      requestData
    );

    return response.data.data;
  },

  /**
   * Get cafe by ID
   */
  getById: async (id: string): Promise<Cafe> => {
    const response = await apiClient.get<GetCafeResponse>(
      API_ENDPOINTS.CAFES.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Get cafe statistics
   */
  getStats: async (id: string): Promise<CafeStats> => {
    const response = await apiClient.get<GetCafeStatsResponse>(
      API_ENDPOINTS.CAFES.STATS(id)
    );
    return response.data.data;
  },

  /**
   * Update cafe
   */
  update: async (id: string, data: UpdateCafeRequest): Promise<Cafe> => {
    const response = await apiClient.put<GetCafeResponse>(
      API_ENDPOINTS.CAFES.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Search cafes
   */
  search: async (params: {
    search?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    limit?: number;
  }): Promise<SearchCafesResponse> => {
    const response = await apiClient.get<SearchCafesResponse>(
      API_ENDPOINTS.CAFES.SEARCH,
      { params }
    );
    return response.data;
  },

  /**
   * Get nearby cafes
   */
  getNearby: async (
    latitude: number,
    longitude: number,
    radius?: number
  ): Promise<Cafe[]> => {
    const response = await apiClient.get<{ success: boolean; data: Cafe[] }>(
      API_ENDPOINTS.CAFES.NEARBY,
      { params: { latitude, longitude, radius } }
    );
    return response.data.data;
  },

  /**
   * Get cafes by city
   */
  getByCity: async (
    city: string,
    page?: number,
    limit?: number
  ): Promise<SearchCafesResponse> => {
    const response = await apiClient.get<SearchCafesResponse>(
      `${API_ENDPOINTS.CAFES.BY_CITY}/${encodeURIComponent(city)}`,
      { params: { page, limit } }
    );
    return response.data;
  },

  /**
   * Get the current cafe admin's cafe
   */
  getMyCafe: async (): Promise<Cafe> => {
    const response = await apiClient.get<GetCafeResponse>(
      API_ENDPOINTS.CAFES.MY_CAFE
    );
    return response.data.data;
  },
};

export default cafeService;