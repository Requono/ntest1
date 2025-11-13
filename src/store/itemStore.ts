import { AirsoftGames } from "@/shared/interfaces/AirsoftGames";
import { create } from "zustand";

interface EventState {
  events: AirsoftGames[];
  setEvents: (events: AirsoftGames[]) => void;
  addEvent: (event: AirsoftGames) => void;
  updateEvent: (event: AirsoftGames) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],

  setEvents: (events) => set({ events }),

  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),

  updateEvent: (event) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === event.id ? event : e)),
    })),

  deleteEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
}));
