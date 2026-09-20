import api from './api';

export interface AuthResponse {
  customerId: string;
  email: string;
  name: string;
  token: string;
  role?: 'CUSTOMER' | 'ADMIN';
}

export interface RegisterPayload {
  email: string;
  password?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobileNumber?: string;
  role?: 'CUSTOMER' | 'ADMIN';
}

export const authService = {
  login: async (email: string, password?: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const formattedPayload = {
      ...payload,
      mobileNumber: payload.mobileNumber || payload.phone || '',
    };
    const response = await api.post<AuthResponse>('/auth/register', formattedPayload);
    return response.data;
  },
};

export default authService;
