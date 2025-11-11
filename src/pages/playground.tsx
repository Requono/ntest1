import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEditEventModal from "../components/AddEditEventModal";
import { useDisclosure } from "@chakra-ui/react";
import { EventModalMode } from "@/enums/EventModalMode";

const mockEvents = [
  {
    title: "Harc a város alatt",
    start: moment().add(1, "days").set({ hour: 10, minute: 0 }).toDate(),
    end: moment().add(1, "days").set({ hour: 11, minute: 0 }).toDate(),
  },
  {
    title: "LARP",
    start: moment().subtract(20, "days").set({ hour: 12, minute: 0 }).toDate(),
    end: moment().subtract(20, "days").set({ hour: 13, minute: 0 }).toDate(),
  },
  {
    title: "Solti jateksz",
    start: moment().subtract(3, "days").startOf("day").toDate(),
    end: moment().subtract(3, "days").endOf("day").toDate(),
  },
  {
    title: "Pesti jateksz",
    start: moment().subtract(10, "days").set({ hour: 9, minute: 0 }).toDate(),
    end: moment().subtract(10, "days").set({ hour: 17, minute: 0 }).toDate(),
  },
  {
    title: "Valami mock",
    start: moment().subtract(15, "days").set({ hour: 9, minute: 30 }).toDate(),
    end: moment().subtract(15, "days").set({ hour: 10, minute: 0 }).toDate(),
  },
];

const Playground = () => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState(mockEvents); // change this later when I have actual events in db
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (data: any) => {
    console.log("Event data: ", data);
    //api request here later

    const newEvent = {
      title: data.title,
      description: data.description,
      start: new Date(data.startDate),
      end: new Date(data.endDate),
      location: data.location,
      maxPlayers: data.maxPlayers,
      visibility: data.visibility,
      status: data.status,
      gameType: data.gameType,
      price: data.price,
    };

    setEvents([...events, newEvent]);
    onClose();
  };

  const handleSelectSlot = (slotInfo: any) => {
    const startDateString = toDateTimeLocal(slotInfo.start);
    setSelectedDate(startDateString);
    setSelectedEvent(null);
    onOpen();
  };

  const handleSelectEvent = (event: any) => {
    const startDateString = toDateTimeLocal(event.start);
    const endDateString = toDateTimeLocal(event.end);
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
          startAccessor="start"
          endAccessor="end"
          style={{ height: "77vh" }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>
      {isOpen && (selectedDate || selectedEvent) && (
        <AddEditEventModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
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
