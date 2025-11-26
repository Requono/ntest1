import {
  AirsoftEventsInput,
  AirsoftEvents,
} from "@/shared/interfaces/AirsoftEventsInput";
import axios from "axios";
import { create } from "zustand";
import { useUserStore } from "./UserStore";

interface EventState {
  events: AirsoftEvents[];
  currentEvent: AirsoftEvents | null;
  editingEvent: AirsoftEvents | null;

  fetchEvents: () => Promise<void>;
  fetchEvent: (eventId: string) => Promise<void>;
  addEvent: (payload: AirsoftEventsInput) => Promise<AirsoftEvents>;
  updateEvent: (
    event: AirsoftEventsInput & { id: string }
  ) => Promise<AirsoftEvents>;
  deleteEvent: (id: string) => Promise<void>;
  editing: {
    setEditingEvent: (event: AirsoftEvents | null) => void;
    clearEditingEvent: () => void;
  };
  joinEvent: (eventId: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  currentEvent: null,
  editingEvent: null,

  fetchEvents: async () => {
    try {
      const response = await axios.get("/api/event/fetch_events");
      const events: AirsoftEvents[] = response.data.map((e: any) => ({
        ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate),
      }));
      set({ events });
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  },
  fetchEvent: async (eventId: string) => {
    try {
      const response = await axios.get(`/api/event/${eventId}`);
      set({
        currentEvent: {
          ...response.data,
          users: response.data.users.map((user: any) => ({
            userId: user.userId,
          })),
        },
      });
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  },
  addEvent: async (payload: AirsoftEventsInput): Promise<AirsoftEvents> => {
    try {
      const response = await axios.post("/api/event/add_event", payload);
      const newEvent: AirsoftEvents = response.data;

      set((state) => ({ events: [...state.events, newEvent] }));
      return newEvent;
    } catch (error) {
      console.error("Failed to fetch events:", error);
      return {} as AirsoftEvents;
    }
  },
  updateEvent: async (
    payload: AirsoftEventsInput & { id: string }
  ): Promise<AirsoftEvents> => {
    try {
      const response = await axios.post("/api/event/update_event", payload);
      const updatedEvent: AirsoftEvents = response.data;

      set((state) => ({
        events: state.events.map((e) =>
          e.id === updatedEvent.id ? updatedEvent : e
        ),
      }));

      return updatedEvent;
    } catch (error) {
      console.error("Failed to update event:", error);
      return {} as AirsoftEvents;
    }
  },
  deleteEvent: async (id) => {
    await axios.delete("/api/event/delete_event", { data: { id } });

    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    }));
  },
  editing: {
    setEditingEvent: (event) => set({ editingEvent: event }),
    clearEditingEvent: () => set({ editingEvent: null }),
  },
  joinEvent: async (eventId: string) => {
    try {
      await axios.post("/api/event/join_event", { eventId });
      const userId = useUserStore.getState().userId;
      if (!userId) return;

      set((state) => {
        const updatedEvents = state.events.map((event) =>
          event.id === eventId
            ? {
                ...event,
                users: [...(event.users || []), { userId: userId }],
              }
            : event
        );

        return { events: updatedEvents };
      });
    } catch (error) {
      console.error("Failed to join event:", error);
    }
  },
  leaveEvent: async (eventId: string) => {
    try {
      await axios.post("/api/event/leave_event", { eventId });
      const userId = useUserStore.getState().userId;
      if (!userId) return;

      set((state) => {
        const updatedEvents = state.events.map((event) =>
          event.id === eventId
            ? {
                ...event,
                users: event.users.filter((u: any) => u.userId !== userId),
              }
            : event
        );

        return { events: updatedEvents };
      });
    } catch (error) {
      console.error("Failed to leave event:", error);
    }
  },
}));
