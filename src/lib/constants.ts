export const ROUTES = {
  HOME: '/',
  COMMUNITY: '/community',
  AUTH: '/auth',
  ABOUT: '/about',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SEARCH: '/search',
  NOTIFICATIONS: '/notifications',
  CHAT: '/chat',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    LIKE: '/posts/:id/like',
    COMMENT: '/posts/:id/comments',
  },
  USERS: {
    PROFILE: '/users/:id',
    SEARCH: '/users/search',
  },
  UPLOAD: {
    IMAGE: '/upload/image',
  },
} as const;

export const GENOTYPES = [
  { value: 'SS', label: 'SS (Sickle Cell Anemia)' },
  { value: 'SC', label: 'SC (Sickle Hemoglobin C)' },
  { value: 'SE', label: 'SE (Sickle Hemoglobin E)' },
  { value: 'CC', label: 'CC (Normal)' },
  { value: 'AS', label: 'AS (Sickle Cell Trait)' },
  { value: 'AC', label: 'AC (Hemoglobin C Trait)' },
] as const;

export const USER_ROLES = [
  { value: 'patient', label: 'Patient', icon: 'Heart' },
  { value: 'doctor', label: 'Doctor', icon: 'Stethoscope' },
] as const;

export const POST_LIMITS = {
  MAX_CONTENT_LENGTH: 1000,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;

export const PAGINATION = {
  POSTS_PER_PAGE: 10,
  COMMENTS_PER_PAGE: 5,
} as const;

export const WEBSOCKET_EVENTS = {
  NEW_POST: 'new_post',
  POST_LIKED: 'post_liked',
  NEW_COMMENT: 'new_comment',
  POST_DELETED: 'post_deleted',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  NEW_MESSAGE: 'new_message',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'theme',
  USER_PREFERENCES: 'user_preferences',
} as const;
