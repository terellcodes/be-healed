const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Define the structure of our API request bodies
interface QueryRequestBody {
  query: string;
  systemPrompt?: string;
}

type ApiRequestBody = QueryRequestBody;

export async function fetchApi(endpoint: string, options: Omit<RequestInit, 'body'> & { body?: ApiRequestBody } = {}) {
  const url = `${API_URL}${endpoint}`
  
  // If body is already a string, don't stringify it again
  const body = options.body ? JSON.stringify(options.body) : undefined;

  const response = await fetch(url, {
    ...options,
    body,
    credentials: 'include',  // Include credentials in the request
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export interface QueryResponse {
  answer: string;
  context?: Record<string, unknown>;
}

export const api = {
  health: () => fetchApi('/health'),
  query: (query: string, systemPrompt?: string) => {
    // Validate query before sending
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }
    
    return fetchApi('/api/query', {
      method: 'POST',
      body: { 
        query: query.trim(),
        systemPrompt
      },
    }) as Promise<QueryResponse>;
  },
} 