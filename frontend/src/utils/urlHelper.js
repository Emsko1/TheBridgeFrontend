import api from '../services/api';

/**
 * Resolves a photo path to a full URL.
 * @param {string} path - The photo path (relative or absolute).
 * @returns {string} - The full URL.
 */
export const resolvePhotoUrl = (path) => {
    if (!path) return 'https://picsum.photos/seed/placeholder/800/600';

    // If it's already an absolute URL (http/https) or a data URI, return as is.
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    // Get the base URL from the configured axios instance
    const baseUrl = api.defaults.baseURL || '';

    // Clean up slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // Handle caching/timestamp busting if needed (optional)
    // return `${cleanBase}${cleanPath}?t=${Date.now()}`; 

    return `${cleanBase}${cleanPath}`;
};
