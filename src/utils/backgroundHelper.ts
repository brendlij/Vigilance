/**
 * Image backgrounds helper
 * Fetches images from backend
 */

const API_BASE = "http://localhost:8080/api";

export interface BackgroundImage {
  url: string;
  credit?: string;
}

/**
 * Get current background image from backend
 */
export const getBackgroundFromBackend = async (): Promise<BackgroundImage> => {
  try {
    const response = await fetch(`${API_BASE}/current-image`);
    if (!response.ok) {
      throw new Error("Failed to fetch current image");
    }
    const data = await response.json();

    return {
      url: data.url ? `${API_BASE}${data.url}` : "",
      credit: "Custom upload",
    };
  } catch (error) {
    console.warn("Failed to fetch from backend, using fallback");
    return getFallbackImage();
  }
};

/**
 * Upload new background image to backend
 */
export const uploadBackgroundImage = async (
  file: File
): Promise<BackgroundImage> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return {
      url: `${API_BASE}${data.url}`,
      credit: "Custom upload",
    };
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

/**
 * Fallback image (no API key needed)
 */
export const getFallbackImage = (): BackgroundImage => {
  const timestamp = Date.now();
  const url = `https://picsum.photos/3840/2160?t=${timestamp}`;

  return {
    url,
    credit: "Random photo from picsum.photos",
  };
};

/**
 * Get a random picsum image (deprecated - use backend instead)
 */
export const getRandomBackground = (): BackgroundImage => {
  return getFallbackImage();
};

/**
 * Local background options (deprecated - use backend instead)
 */
export const getLocalBackground = (): BackgroundImage => {
  return getFallbackImage();
};
