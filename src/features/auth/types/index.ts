export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'doctor';
  genotype?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<{ error?: string }>;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: string;
  genotype?: string;
  bio?: string;
}

export interface ProfileUpdateData {
  role?: string;
  genotype?: string;
  bio?: string;
  fullName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
