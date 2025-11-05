// filepath: /Users/KeapeR/Desktop/vscode/capstone/Frontend/src/lib/api.ts

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to save token
export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Helper function to remove token
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// API request helper with token
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add token to headers if it exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API functions
export const authApi = {
  // Signup new user
  signup: async (email: string, password: string, name: string) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    // Save token after successful signup
    if (data.token) {
      saveToken(data.token);
    }
    
    return data;
  },

  // Login existing user
  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Save token after successful login
    if (data.token) {
      saveToken(data.token);
    }
    
    return data;
  },

  // Get current user profile (protected route)
  getProfile: async () => {
    return await apiRequest('/auth/me', {
      method: 'GET',
    });
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Remove token even if request fails
      removeToken();
    }
  },
};
