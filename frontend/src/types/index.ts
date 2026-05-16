export interface User {
  email: string;
  fullName: string;
  nic: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}
