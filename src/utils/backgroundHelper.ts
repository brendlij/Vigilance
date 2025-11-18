/**
 * Image backgrounds helper
 * Fetches random beautiful images for dashboard background
 */

export interface BackgroundImage {
  url: string;
  credit?: string;
}

/**
 * Get a random picsum image
 * Using picsum.photos for random beautiful images with high resolution
 */
export const getRandomBackground = (): BackgroundImage => {
  // picsum.photos generates a new random image each time with cache-busting
  const timestamp = Date.now();
  const url = `https://picsum.photos/3840/2160?t=${timestamp}`;

  return {
    url,
    credit: "Random photo from picsum.photos",
  };
};

/**
 * Get a random unsplash image (backup option)
 * Using unsplash API for high-quality free images
 */
export const getRandomBackgroundUnsplash =
  async (): Promise<BackgroundImage> => {
    try {
      // Using Unsplash API - random high-quality images
      // Query: homelab, server room, technology, datacenter backgrounds
      const query = "homelab OR server OR datacenter OR technology OR network";
      const width = 1920;
      const height = 1080;

      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${query}&w=${width}&h=${height}&client_id=YOUR_UNSPLASH_ACCESS_KEY`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();

      return {
        url: data.urls.regular,
        credit: `Photo by ${data.user.name}`,
      };
    } catch (error) {
      console.warn("Failed to fetch from Unsplash, using picsum.photos");
      return getRandomBackground();
    }
  };

/**
 * Local background options (no API key needed)
 * Using placeholder images - kept for reference
 */
export const getLocalBackground = (): BackgroundImage => {
  // Using picsum.photos for truly random images each time
  return getRandomBackground();
};

/**
 * Get a solid color background (fallback)
 */
export const getSolidBackground = (): BackgroundImage => {
  const colors: BackgroundImage[] = [
    {
      url: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      credit: "Blue Gradient",
    },
    {
      url: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      credit: "Slate Gradient",
    },
    {
      url: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      credit: "Dark Blue",
    },
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return randomColor as BackgroundImage;
};
