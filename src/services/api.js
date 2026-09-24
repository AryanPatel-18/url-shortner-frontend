const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '')
const API_PREFIX = '/api/v1'

export class ApiError extends Error {
  constructor(message, { status = 0, retryAfter = null, data = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.retryAfter = retryAfter
    this.data = data
  }
}

function getErrorMessage(data, status) {
  if (data && typeof data.message === 'string' && data.message.trim()) {
    return data.message
  }

  if (status === 401) return 'Authentication failed. Please sign in again.'
  if (status === 404) return 'The requested resource was not found.'
  if (status === 409) return 'This record already exists.'
  if (status === 429) return 'Too many requests. Please try again shortly.'
  if (status >= 500) return 'The server could not complete that request.'
  return 'The request could not be completed.'
}

async function parseResponse(response) {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

async function request(path, { method = 'GET', body, token, signal } = {}) {
  const headers = { Accept: 'application/json' }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Cannot reach the URL shortener API. Check the backend and try again.')
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    const retryAfterValue = response.headers.get('Retry-After')
    const retryAfter = retryAfterValue && Number.isFinite(Number(retryAfterValue))
      ? Number(retryAfterValue)
      : null

    throw new ApiError(getErrorMessage(data, response.status), {
      status: response.status,
      retryAfter,
      data,
    })
  }

  return data
}

export function registerUser(payload) {
  return request(`${API_PREFIX}/users/register`, { method: 'POST', body: payload })
}

export function loginUser(payload) {
  return request(`${API_PREFIX}/users/login`, { method: 'POST', body: payload })
}

export function checkEmailVerification(email) {
  const query = new URLSearchParams({ email })
  return request(`${API_PREFIX}/users/check-verification?${query}`)
}

export function resendVerificationEmail(email) {
  return request(`${API_PREFIX}/users/resend-verification`, {
    method: 'POST',
    body: { email },
  })
}

export function deleteAccount(token) {
  return request(`${API_PREFIX}/users/me`, {
    method: 'DELETE',
    token,
  })
}

export function createShortUrl(originalUrl, token) {
  return request(`${API_PREFIX}/urls`, {
    method: 'POST',
    body: { originalUrl },
    token,
  })
}

export function listUrls({ page = 0, size = 20, token, signal } = {}) {
  const query = new URLSearchParams({ page: String(page), size: String(size) })
  return request(`${API_PREFIX}/urls?${query}`, { token, signal })
}

export function getUrl(urlId, token) {
  return request(`${API_PREFIX}/urls/${encodeURIComponent(urlId)}`, { token })
}

export function updateUrlStatus(urlId, status, token) {
  return request(`${API_PREFIX}/urls/${encodeURIComponent(urlId)}`, {
    method: 'PATCH',
    body: { status },
    token,
  })
}

export function deleteUrl(urlId, token) {
  return request(`${API_PREFIX}/urls`, {
    method: 'DELETE',
    body: { urlId },
    token,
  })
}

export function getShortUrl(shortCode) {
  return `${API_BASE_URL}/${encodeURIComponent(shortCode)}`
}
