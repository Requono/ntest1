import { deriveLoginHash } from "@/utils/crypto";
import axios from "axios";
import { create } from "zustand";

interface GroupInvite {
  id: string;
  userId: string;
  invitedBy: string;
  createdAt: string;
  group: {
    id: string;
    name: string;
  };
}

interface UserState {
  userId: string | null;
  email: string | null;
  username: string | null;
  key: CryptoKey | null;
  groupId: string | null;
  invites: GroupInvite[];

  createUser: (username: string, email: string, hash: string) => Promise<void>;
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

  fetchInvites: () => Promise<void>;
  acceptInvite: (inviteId: string) => Promise<void>;
  declineInvite: (inviteId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  email: "",
  key: null,
  userId: "",
  username: "",
  groupId: null,
  invites: [] as GroupInvite[],

  createUser: async (username, email, hash) => {
    try {
      const response = await axios.post("/api/user/create_user", {
        username,
        email,
        hash,
      });

      set({
        userId: response.data.id,
        username: response.data.username,
        email: response.data.email,
        groupId: response.data.groupId || null,
      });
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  },
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
      await axios.post("/api/user/logout_user");

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
      const response = await axios.get("/api/user/get_user");
      if (response.data?.user) {
        set({
          userId: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          groupId: response.data.user.groupId,
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

      const response = await axios.post("/api/user/update_user", {
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
  fetchInvites: async () => {
    try {
      const response = await axios.get("/api/group/invite/list_invites");
      set({ invites: response.data });
    } catch (error) {
      console.error("fetchInvites() failed:", error);
    }
  },
  acceptInvite: async (inviteId: string) => {
    try {
      await axios.post("/api/group/invite/accept", { inviteId });
      await get().fetchUser();
      await get().fetchInvites();
    } catch (error) {
      console.error("acceptInvite() failed:", error);
    }
  },
  declineInvite: async (inviteId: string) => {
    try {
      await axios.post("/api/group/invite/decline", { inviteId });
      await get().fetchInvites();
    } catch (error) {
      console.error("declineInvite() failed:", error);
    }
  },
}));
