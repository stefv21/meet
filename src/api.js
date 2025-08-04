// src/api.js
import mockData from './mock-data';
import NProgress from 'nprogress';

// Force mock data in production to avoid CORS issues
const useMock = true; // Temporarily force mock mode

console.log('API Debug:', {
  hostname: window.location.hostname,
  isDev: import.meta.env.DEV,
  usesMock: useMock
});

async function checkToken(token) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );
    return res.json();
  } catch {
    return { error: 'invalid_token' };
  }
}

function removeQuery() {
  if (window.history.replaceState) {
    const { protocol, host, pathname } = window.location;
    const newUrl = `${protocol}//${host}${pathname}`;
    window.history.replaceState({}, '', newUrl);
  }
}

export async function getAccessToken() {
  // Skip token logic entirely when using mock data
  if (useMock) {
    return null;
  }
  
  let tokenData = sessionStorage.getItem('access_token');
  let token = null;
  
  // Parse and validate stored token
  if (tokenData) {
    try {
      const parsed = JSON.parse(tokenData);
      if (parsed.expires > Date.now()) {
        token = parsed.token;
      } else {
        sessionStorage.removeItem('access_token');
      }
    } catch {
      sessionStorage.removeItem('access_token');
    }
  }

  // 1) If we already have a token, verify it
  if (token) {
    const info = await checkToken(token);
    if (info.error) {
      sessionStorage.removeItem('access_token');
      token = null;
    }
  }

  // 2) If no valid token, check URL for code (but do NOT auto-redirect)
  if (!token) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      // No token & no code: bail out (we’ll mock instead)
      return null;
    }

    // Exchange code for token
    const exchange = await fetch(
      `https://pifv3u6884.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeURIComponent(
        code
      )}`
    );
    const { access_token } = await exchange.json();

    // Store with expiration (1 hour)
    const tokenData = {
      token: access_token,
      expires: Date.now() + 3600000
    };
    sessionStorage.setItem('access_token', JSON.stringify(tokenData));
    removeQuery();
    return access_token;
  }

  // 3) Clean up URL and return existing token
  removeQuery();
  return token;
}

/**
 * Get the list of events.
 * - If offline: return cached events
 * - If useMock: return mockData (dev or VITE_USE_MOCK)
 * - Otherwise: perform real OAuth flow and fetch
 */
export const getEvents = async () => {
  if (!navigator.onLine) {
    NProgress.done();
    const cached = localStorage.getItem('lastEvents');
    return cached ? JSON.parse(cached) : [];
  }

  NProgress.start();

  // Use mock data before doing any real OAuth
  if (useMock) {
    NProgress.done();
    return mockData;
  }

  // Real flow
  const token = await getAccessToken();
  if (!token) {
    NProgress.done();
    return [];
  }

  const url = 'https://pifv3u6884.execute-api.us-east-1.amazonaws.com/dev/api/get-events';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();

    if (result && result.events) {
      NProgress.done();
      localStorage.setItem('lastEvents', JSON.stringify(result.events));
      return result.events;
    }
  } catch {
    // Return empty array on any error
  }

  NProgress.done();
  return [];
};

/**
 * Pull out all unique locations from an array of event objects.
 * @param {Array} events - Array of event objects with location property
 * @returns {Array} Array of unique location strings
 */
export function extractLocations(events = []) {
  const allLocations = events.map(event => event?.location).filter(Boolean);
  return [...new Set(allLocations)];
}
