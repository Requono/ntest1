import { create } from "zustand";

interface UserState {
  userId: string;
  email: string | null;
  username: string | null;
  key: CryptoKey | null;

  initializeUser: (
    user: { userId: string; email: string; username: string },
    key: CryptoKey
  ) => void;
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
  getUserId: () => {
    const state = get();
    return state.userId;
  },
}));
