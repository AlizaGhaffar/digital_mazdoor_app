import axios from 'axios';

// Replace with your local IP if testing on a physical device
const BASE_URL = 'http://10.132.115.44:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const orchestrate = async (prompt, locationContext = null) => {
  try {
    const payload = { prompt };
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
