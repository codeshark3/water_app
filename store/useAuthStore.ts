import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
// Define the AuthStore type
type User = {
  email: string;
  password: string;
  name?: string;
} | null;

type AuthState = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
  isLoading: boolean;
};

// Create Zustand store with AsyncStorage persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, // Initial state
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          // Here you would typically make an API call to authenticate
          // For now simulating a delay and success
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Validate email/password
          if (!email || !password) {
            throw new Error("Email and password are required");
          }

          // Set mock user data to simulate successful login
          set({
            user: {
              email,
              password,
              name: "Test User", // Adding a mock name
            },
            isLoading: false,
          });
          router.replace("/");
          return true;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true });
          // Here you would typically make an API call to register
          // For now simulating a delay and success
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Validate inputs
          if (!email || !password || !name) {
            throw new Error("All fields are required");
          }

          // Set the newly registered user
          set({
            user: { email, password, name },
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => set({ user: null }), // Remove user on logout
    }),
    {
      name: "auth-storage", // Key for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Persistent storage
    }
  )
);
