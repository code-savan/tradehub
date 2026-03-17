import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const DEMO_CREDENTIALS = {
  email: 'demo@trade.com',
  password: 'password123',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
          set({
            user: {
              email: DEMO_CREDENTIALS.email,
              name: 'John',
              avatar: undefined,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } else {
          set({
            isLoading: false,
            error: 'Invalid email or password. Try demo@trade.com / password123',
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'tradeflow-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
