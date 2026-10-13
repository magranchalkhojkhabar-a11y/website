import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

// An empty base URL keeps local development on Vite's /api proxy.
const api = axios.create({
  baseURL: configuredApiUrl ? configuredApiUrl.replace(/\/$/, '') : '',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('magranchal_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestId = error.response?.headers?.['x-request-id'];

    console.error('API request failed', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      requestId,
      message: error.response?.data?.message || error.message
    });

    return Promise.reject(error);
  }
);

export default api;
