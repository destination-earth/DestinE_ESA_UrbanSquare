let cachedUserId: string | null = null;

/**
 * Extracts user ID from various possible sources
 */
export const getUserId = async (): Promise<string> => {
  // Return cached value if available (and it's not null)
  if (cachedUserId !== null) {
    return cachedUserId;
  }

  const basePath = process.env.BASEPATH || "";

  // Try to get from API endpoint first (server-side headers)
  try {
    const response = await fetch(`${basePath}/api/user`); 
    if (response.ok) {
      const data = await response.json();
      if (data.userId && data.userId !== 'anonymous') {
        cachedUserId = data.userId;
        return data.userId; // Return directly, not cachedUserId
      }
    }
  } catch (error) {
    console.error('Failed to fetch user ID from API:', error);
  }

  // Try to get from meta tag (if set by server)
  const metaUserId = document.querySelector('meta[name="x-auth-request-user"]');
  if (metaUserId) {
    const userIdAttr = metaUserId.getAttribute('content');
    if (userIdAttr && userIdAttr !== 'anonymous') {
      cachedUserId = userIdAttr;
      return userIdAttr; // Return directly, not cachedUserId
    }
  }

  // Try to get from window object (if injected by parent)
  const windowUserId = (window as any).__USER_ID__;
  if (windowUserId) {
    cachedUserId = windowUserId;
    return windowUserId; // Return directly, not cachedUserId
  }

  // Try to parse from oauth2 cookies as a last resort
  const oauth2Cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('_oauth2_proxy='));
  
  if (oauth2Cookie) {
    // Extract a stable hash from the cookie to use as user ID
    const cookieValue = oauth2Cookie.split('=')[1];
    if (cookieValue) {
      // Take first 36 characters as a pseudo-UUID
      const userId = cookieValue.substring(0, 36);
      cachedUserId = userId;
      return userId; // Return directly, not cachedUserId
    }
  }

  // Default to anonymous if no user ID found
  const defaultUserId = 'anonymous';
  cachedUserId = defaultUserId;
  return defaultUserId; // Return directly, not cachedUserId
};