import {
  AirsoftEventsInput,
  AirsoftEvents,
} from "@/shared/interfaces/AirsoftEventsInput";
import axios from "axios";
import { create } from "zustand";

interface EventState {
  events: AirsoftEvents[];
  addEvent: (payload: AirsoftEventsInput) => void;
  updateEvent: (event: AirsoftEvents) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],

  addEvent: async (
    payload: AirsoftEventsInput
  ): Promise<AirsoftEventsInput> => {
    const response = await axios.post("/api/add_event", payload);
    const newEvent = response.data;
    set((state) => ({ events: [...state.events, newEvent] }));
    return newEvent;
  },
  updateEvent: (event: AirsoftEvents) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === event.id ? event : e)),
    })),
  deleteEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
}));
