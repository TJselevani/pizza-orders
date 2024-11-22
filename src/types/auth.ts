export interface AuthResponse {
  endpoint: string;
  consumerKey: string;
  secretKey: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  endpoint?: string;
  consumerKey?: string;
  secretKey?: string;
  isAuthenticated: boolean;
}