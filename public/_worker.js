const FRONTEND_ROUTES = new Set([
  '/', '/home', '/login', '/register', '/dashboard'
]);

const STATIC_EXTENSIONS = new Set([
  '.js', '.css', '.html', '.svg', '.png', '.ico',
  '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2', '.json'
]);

function isStaticAsset(pathname) {
  const lastDot = pathname.lastIndexOf('.');
  if (lastDot === -1) return false;
  return STATIC_EXTENSIONS.has(pathname.substring(lastDot).toLowerCase());
}

function isShortCode(pathname) {
  return /^\/[a-zA-Z0-9]{1,20}$/.test(pathname);
}

function errorPage(title, message, status) {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} — URLZS</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex;
           align-items: center; justify-content: center;
           min-height: 100vh; margin: 0; background: #f8fafc; color: #172033; }
    .card { text-align: center; padding: 2rem; max-width: 24rem; }
    h1 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; }
    p  { font-size: 0.875rem; color: #64748b; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    // 1. Known frontend routes → serve the SPA
    if (FRONTEND_ROUTES.has(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 2. Static assets → serve directly
    if (pathname.startsWith('/assets/') || isStaticAsset(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 3. Not a valid short code pattern → serve SPA
    if (!isShortCode(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 4. It looks like a short code → resolve via backend API
    const shortCode = pathname.slice(1);
    const apiBase = env.API_BASE_URL || 'https://api.urlzs.xyz';

    try {
      const apiResponse = await fetch(
        `${apiBase}/api/v1/redirect/${encodeURIComponent(shortCode)}`,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        }
      );

      if (apiResponse.status === 404) {
        return errorPage('Link Not Found', 'This short link does not exist.', 404);
      }

      if (apiResponse.status === 410) {
        return errorPage('Link Unavailable', 'This short link is no longer active.', 410);
      }

      if (!apiResponse.ok) {
        const text = await apiResponse.text();
        return new Response(`Edge Worker Debug: Backend returned ${apiResponse.status}\nBody: ${text}`, { status: 500 });
      }

      const data = await apiResponse.json();

      if (!data?.originalUrl) {
        return new Response(`Edge Worker Debug: originalUrl missing from response\nData: ${JSON.stringify(data)}`, { status: 500 });
      }

      // Security: validate the URL
      try {
        const parsed = new URL(data.originalUrl);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return errorPage('Invalid Link', 'This link points to an invalid destination.', 400);
        }
      } catch {
        return errorPage('Invalid Link', 'This link points to an invalid destination.', 400);
      }

      // SUCCESS: Return 302 redirect — instant, no React needed
      return new Response(null, {
        status: 302,
        headers: { 'Location': data.originalUrl },
      });

    } catch (err) {
      // Network error talking to backend
      return new Response(`Edge Worker Debug: Fetch failed.\nError: ${err.message}`, { status: 500 });
    }
  }
};
