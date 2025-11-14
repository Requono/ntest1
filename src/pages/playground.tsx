import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEditEventModal from "../components/AddEditEventModal";
import { useDisclosure } from "@chakra-ui/react";
import { EventModalMode } from "@/shared/enums/EventModalMode";
import { useEventStore } from "@/store/eventStore";

const Playground = () => {
  const localizer = momentLocalizer(moment);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const fetchAllEvents = useEventStore.getState().fetchEvents;
  const events = useEventStore((state) => state.events);
  useEffect(() => {
    fetchAllEvents();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSelectSlot = (slotInfo: any) => {
    const startDateString = toDateTimeLocal(slotInfo.start);
    setSelectedDate(startDateString);
    setSelectedEvent(null);
    onOpen();
  };

  const handleSelectEvent = (event: any) => {
    const startDateString = toDateTimeLocal(event.startDate);
    const endDateString = toDateTimeLocal(event.endDate);
    setSelectedDate("");
    setSelectedEvent({
      ...event,
      startDate: startDateString,
      endDate: endDateString,
    });

    onOpen();
  };

  const toDateTimeLocal = (date: Date | string | undefined) => {
    if (!date) return "";

    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";

    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <>
      <div style={{ margin: "100px" }}>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          startAccessor="startDate"
          endAccessor="endDate"
          style={{ height: "77vh" }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>
      {isOpen && (selectedDate || selectedEvent) && (
        <AddEditEventModal
          isOpen={isOpen}
          onClose={onClose}
          initialData={
            selectedEvent
              ? selectedEvent
              : selectedDate
              ? { startDate: selectedDate }
              : undefined
          }
          mode={selectedEvent ? EventModalMode.EDIT : EventModalMode.ADD}
        />
      )}
    </>
  );
};

export default Playground;
