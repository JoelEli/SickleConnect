import { API_ENDPOINTS } from './constants';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (data: {
      email: string;
      password: string;
      fullName: string;
      role: string;
      genotype?: string;
      bio?: string;
    }) =>
      this.request(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    me: () => this.request(API_ENDPOINTS.AUTH.ME),

    updateProfile: (data: {
      role?: string;
      genotype?: string;
      bio?: string;
      fullName?: string;
    }) =>
      this.request(API_ENDPOINTS.AUTH.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    logout: () =>
      this.request(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      }),
  };

  // Posts endpoints
  posts = {
    getAll: (page = 1, limit = 10) =>
      this.request(`${API_ENDPOINTS.POSTS.LIST}?page=${page}&limit=${limit}`),

    create: (data: { content: string; imageUrl?: string }) =>
      this.request(API_ENDPOINTS.POSTS.CREATE, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    like: (postId: string) =>
      this.request(API_ENDPOINTS.POSTS.LIKE.replace(':id', postId), {
        method: 'POST',
      }),

    getComments: (postId: string) =>
      this.request(API_ENDPOINTS.POSTS.COMMENT.replace(':id', postId)),

    addComment: (postId: string, content: string) =>
      this.request(API_ENDPOINTS.POSTS.COMMENT.replace(':id', postId), {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  };

  // Users endpoints
  users = {
    getProfile: (userId: string) =>
      this.request(API_ENDPOINTS.USERS.PROFILE.replace(':id', userId)),

    search: (query: string) =>
      this.request(`${API_ENDPOINTS.USERS.SEARCH}?q=${encodeURIComponent(query)}`),
  };

  // Upload endpoints
  upload = {
    image: (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      return this.request(API_ENDPOINTS.UPLOAD.IMAGE, {
        method: 'POST',
        headers: {
          // Don't set Content-Type, let browser set it with boundary
        },
        body: formData,
      });
    },
  };
}

export const apiClient = new ApiClient(API_BASE);
export default apiClient;
