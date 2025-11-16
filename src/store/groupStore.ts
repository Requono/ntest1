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

  fetchGroupData: (groupId: string) => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  fetchGroupMembers: (groupId: string) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set) => ({
  currentGroup: null,
  members: [],

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
      const res = await axios.get(`/api/group/${groupId}`);
      set({
        currentGroup: {
          id: res.data.id,
          name: res.data.name,
          createdById: res.data.createdById,
        },
        members: res.data.members || [],
      });
    } catch (err) {
      console.error("fetchGroupData failed:", err);
    }
  },
  fetchGroupMembers: async (groupId) => {
    const res = await axios.get(`/api/group/${groupId}/fetch_group_members`);
    set({ members: res.data });
  },
}));
