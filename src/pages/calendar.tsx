import { Calendar as ReactCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEditEventModal from "../components/AddEditEventModal";
import { useDisclosure } from "@chakra-ui/react";
import { EventModalMode } from "@/shared/enums/EventModalMode";
import { useEventStore } from "@/store/eventStore";
import Header from "@/components/Header";
import { formatDateForInput } from "@/utils/formatDateForInput";
import Footer from "@/components/Footer";

const Calendar = () => {
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
    const startDateString = formatDateForInput(slotInfo.start);
    setSelectedDate(startDateString);
    setSelectedEvent(null);
    onOpen();
  };

  const handleSelectEvent = (event: any) => {
    const startDateString = formatDateForInput(event.startDate);
    const endDateString = formatDateForInput(event.endDate);
    setSelectedDate("");
    setSelectedEvent({
      ...event,
      startDate: startDateString,
      endDate: endDateString,
    });

    onOpen();
  };

  return (
    <>
      <Header />
      <div style={{ margin: "100px" }}>
        <ReactCalendar
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
      <Footer />
    </>
  );
};

export default Calendar;
