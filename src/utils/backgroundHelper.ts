/**
 * Image backgrounds helper
 * Fetches random beautiful images for dashboard background
 */

export interface BackgroundImage {
  url: string;
  credit?: string;
}

/**
 * Get a random unsplash image
 * Using unsplash API for high-quality free images
 */
export const getRandomBackground = async (): Promise<BackgroundImage> => {
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
    console.warn("Failed to fetch from Unsplash, using local gradient");
    // Fallback to placeholder service or local gradient
    return getLocalBackground();
  }
};

/**
 * Local background options (no API key needed)
 * Using placeholder images
 */
export const getLocalBackground = (): BackgroundImage => {
  const backgrounds: BackgroundImage[] = [
    {
      url: "https://images.unsplash.com/photo-1639322537228-f710d846a88d?w=1920&h=1080&fit=crop",
      credit: "Server Room",
    },
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
      credit: "Datacenter",
    },
    {
      url: "https://images.unsplash.com/photo-1620712014215-c8067910aaa4?w=1920&h=1080&fit=crop",
      credit: "Server Technology",
    },
    {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop",
      credit: "Network Infrastructure",
    },
    {
      url: "https://images.unsplash.com/photo-1629904853893-c2c8981a1e5f?w=1920&h=1080&fit=crop",
      credit: "Tech Background",
    },
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
      credit: "Server Infrastructure",
    },
    {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
      credit: "Technology Abstract",
    },
    {
      url: "https://images.unsplash.com/photo-1637599810694-4ee1afc82490?w=1920&h=1080&fit=crop",
      credit: "Digital Network",
    },
  ];

  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  return randomBg as BackgroundImage;
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
