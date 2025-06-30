// src/api.js
import mockData from './mock-data';
import NProgress from 'nprogress';

// Use mock data in dev or when VITE_USE_MOCK=true
const useMock = import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true';
console.log('useMock:', useMock, 'VITE_USE_MOCK:', import.meta.env.VITE_USE_MOCK, 'import.meta.env.DEV:', import.meta.env.DEV);

async function checkToken(token) {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
  );
  return res.json();
}

function removeQuery() {
  if (window.history.replaceState) {
    const { protocol, host, pathname } = window.location;
    const newUrl = `${protocol}//${host}${pathname}`;
    window.history.replaceState({}, '', newUrl);
  }
}

export async function getAccessToken() {
  let token = localStorage.getItem('access_token');

  // 1) If we already have a token, verify it
  if (token) {
    const info = await checkToken(token);
    if (info.error) {
      localStorage.removeItem('access_token');
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

    localStorage.setItem('access_token', access_token);
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

  NProgress.done();
  return [];
};

/**
 * Pull out all unique locations from an array of event objects.
 */
export function extractLocations(events = []) {
  const allLocs = events.map(e => e.location);
  return [...new Set(allLocs)];
}
