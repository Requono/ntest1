import { create } from "zustand";

export enum AirsoftGameType {
  LARP = "LARP",
  MILSIM = "Milsim",
  CQB = "CQB",
}

interface AirsoftGames {
  id: string;
  type: AirsoftGameType;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  description: string;
}

interface UserState {
  email: string | null;
  items: AirsoftGames[];
  key: CryptoKey | null;
  createEvent: (payload: AirsoftGames) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (payload: AirsoftGames) => void;
  initializeUser: (email: string, key: CryptoKey) => void;
  initializeItems: (items: AirsoftGames[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  email: "",
  items: [],
  key: null,
  createEvent: (payload: AirsoftGames) => {
    set((state) => ({
      items: [...state.items, payload],
    }));
  },
  deleteEvent: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  updateEvent: (payload: AirsoftGames) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== payload.id) return item;

        return payload;
      }),
    }));
  },
  initializeUser: (email: string, key: CryptoKey) => {
    return set(() => ({
      key,
      email,
    }));
  },
  initializeItems: (items: AirsoftGames[]) => {
    set(() => ({
      items,
    }));
  },
}));
