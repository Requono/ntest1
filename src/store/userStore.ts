import { deriveLoginHash } from "@/utils/crypto";
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
  fetchUser: () => Promise<void>;
  updateUser: (updatedFields: {
    username?: string;
    email?: string;
    newPassword?: string;
  }) => Promise<{
    user: {
      userId: string;
      username: string;
      email: string;
    };
  } | void>;
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
  fetchUser: async () => {
    try {
      const response = await axios.get("/api/get_user");
      if (response.data?.user) {
        set({
          userId: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  },
  updateUser: async (updatedFields: {
    username?: string;
    email?: string;
    newPassword?: string;
  }) => {
    try {
      const iterations = 600000;

      let newHash = undefined;
      if (updatedFields.newPassword && updatedFields.email) {
        newHash = await deriveLoginHash(
          updatedFields.newPassword,
          updatedFields.email,
          iterations
        );
      }

      const response = await axios.post("/api/update_user", {
        username: updatedFields.username,
        email: updatedFields.email,
        newHash,
      });

      set(() => ({
        username: response.data.user.username,
        email: response.data.user.email,
      }));

      return response.data;
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  },
}));
