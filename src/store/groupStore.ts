import { create } from "zustand";
import axios from "axios";

interface Group {
  id: string;
  name: string;
  createdById: string;
}

interface GroupState {
  currentGroup: Group | null;
  members: { id: string; username: string }[];
  usersWithoutGroup: { id: string; username: string; email: string }[];

  fetchGroupData: (groupId: string) => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  fetchGroupMembers: (groupId: string) => Promise<void>;
  fetchUsersWithoutGroup: () => Promise<void>;
  inviteUserToGroup: (userId: string, groupId: string) => Promise<void>;
  removeUserFromGroup: (userId: string, groupId: string) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set) => ({
  currentGroup: null,
  members: [],
  usersWithoutGroup: [],

  createGroup: async (name: string) => {
    try {
      const response = await axios.post("/api/group/create_group", {
        name,
      });

      set({ currentGroup: response.data });
    } catch (error) {
      console.error("createGroup() failed:", error);
    }
  },
  fetchGroupData: async (groupId: string) => {
    try {
      const response = await axios.get(`/api/group/${groupId}`);
      set({
        currentGroup: {
          id: response.data.id,
          name: response.data.name,
          createdById: response.data.createdById,
        },
        members: response.data.members || [],
      });
    } catch (err) {
      console.error("fetchGroupData failed:", err);
    }
  },
  fetchGroupMembers: async (groupId) => {
    try {
      const response = await axios.get(
        `/api/group/${groupId}/fetch_group_members`
      );
      set({ members: response.data });
    } catch (error) {
      console.error("Failed to fetch group members:", error);
    }
  },
  inviteUserToGroup: async (userId: string, groupId: string) => {
    try {
      await axios.post("/api/group/invite/send_invite", {
        targetUserId: userId,
        groupId,
      });
    } catch (error) {
      console.error("Failed to invite user:", error);
    }
  },
  removeUserFromGroup: async (userId: string, groupId: string) => {
    try {
      await axios.post("/api/group/remove_user", {
        userIdToRemove: userId,
        groupId,
      });

      const updated = await axios.get(
        `/api/group/${groupId}/fetch_group_members`
      );
      set({ members: updated.data });
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  },
  fetchUsersWithoutGroup: async () => {
    try {
      const response = await axios.get("/api/group/get_users_without_group");
      set({ usersWithoutGroup: response.data });
    } catch (error) {
      console.error("Failed to fetch users without group: ", error);
    }
  },
}));
