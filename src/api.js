import mockData from './mock-data';
import NProgress from 'nprogress';

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

  // Check if token is valid
  if (token) {
    const info = await checkToken(token);
    if (info.error) {
      localStorage.removeItem('access_token');
      token = null;
    }
  }

  // If no valid token, look for a code in the URL or redirect
  if (!token) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      // Request an auth URL and send the user there
      const resp = await fetch(
        'https://pifv3u6884.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url'
      );
      const { authUrl } = await resp.json();
      window.location.href = authUrl;
      return null; // navigation away
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

  // Clean up the URL and return the existing token
  removeQuery();
  return token;
}

/**
 * Get the list of events.
 * - On localhost: return mockData
 * - Otherwise: fetch real events using the OAuth token
 */
export const getEvents = async () => {
  NProgress.start();

  if (window.location.href.startsWith("http://localhost")) {
    NProgress.done();
    return mockData.events;
  }

  const token = await getAccessToken();
  if (!token) return [];

  const res = await fetch(
    `https://pifv3u6884.execute-api.us-east-1.amazonaws.com/dev/api/events/${token}`
  );
  const json = await res.json();
  return json.events || [];
}

/**
 * Pull out all unique locations from an array of event objects.
 */
export function extractLocations(events = []) {
  const allLocs = events.map(e => e.location);
  return [...new Set(allLocs)];
}
