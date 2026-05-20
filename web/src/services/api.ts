import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LocationContext {
  name: string;
  lat?: number;
  lng?: number;
}

export interface OrchestrationRequest {
  user_id: string;
  prompt: string;
  location_context?: LocationContext;
}

export const orchestrate = async (prompt: string, locationContext: LocationContext | null = null) => {
  try {
    const payload: Partial<OrchestrationRequest> = {
      user_id: 'guest',
      prompt,
    };
    if (locationContext) {
      payload.location_context = locationContext;
    }
    const response = await api.post('/v1/orchestrate', payload);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health Check Failed:', error);
    return { status: 'unhealthy' };
  }
};

export default api;
