import apiClient from '@/lib/api-client';

export interface UploadImageResponse {
  success: boolean;
  data: {
    url: string;
  };
}

/**
 * Upload a single image file to the backend, which stores it in Cloudflare R2.
 * @param file - The File object selected by the user
 * @param folder - Optional folder ('cafes' | 'users' | 'events' | 'offers' | 'images')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  folder: 'cafes' | 'users' | 'events' | 'offers' | 'images' = 'images'
): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<UploadImageResponse>(
    `/upload/image?folder=${folder}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data.url;
}
