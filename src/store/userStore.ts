import axios from "axios";
import { create } from "zustand";

interface UserState {
  userId: string | null;
  email: string | null;
  username: string | null;
  key: CryptoKey | null;

  initializeUser: (
    user: { userId: string; email: string; username: string },
    key: CryptoKey
  ) => void;
  logoutUser: () => Promise<void>;
  getUserId: () => string | null;
}

export const useUserStore = create<UserState>((set, get) => ({
  email: "",
  key: null,
  userId: "",
  username: "",

  initializeUser: (
    user: { userId: string; email: string; username: string },
    key: CryptoKey
  ) => {
    return set(() => ({
      key,
      email: user.email,
      userId: user.userId,
      username: user.username,
    }));
  },
  logoutUser: async () => {
    try {
      await axios.post("/api/logout_user");

      set({
        userId: "",
        email: "",
        username: "",
        key: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
  getUserId: () => {
    const state = get();
    return state.userId;
  },
}));
