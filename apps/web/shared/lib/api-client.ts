import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const serverMsg =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message;
    if (Array.isArray(serverMsg)) return serverMsg.join(", ");
    return serverMsg;
  }
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem('access_token')
    ) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    error.message = getErrorMessage(error);
    return Promise.reject(error);
  },
);

export default apiClient;
