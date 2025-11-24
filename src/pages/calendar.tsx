import { Calendar as ReactCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEditEventModal from "../components/AddEditEventModal";
import InviteModal from "../components/InviteModal";
import { Box, useDisclosure } from "@chakra-ui/react";
import { EventModalMode } from "@/shared/enums/EventModalMode";
import { useEventStore } from "@/store/EventStore";
import Header from "@/components/Header";
import { formatDateForInput } from "@/utils/formatDateForInput";
import Footer from "@/components/Footer";
import { useUserStore } from "@/store/UserStore";
import { requireAuth } from "@/utils/requireAuth";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
require("moment/locale/hu.js");

const Calendar = () => {
  const localizer = momentLocalizer(moment);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { invites, fetchInvites, acceptInvite, declineInvite } = useUserStore();
  const fetchAllEvents = useEventStore.getState().fetchEvents;
  const events = useEventStore((state) => state.events);
  useEffect(() => {
    fetchAllEvents();
  }, []);
  const {
    isOpen: isEventOpen,
    onOpen: onEventOpen,
    onClose: onEventClose,
  } = useDisclosure();
  const {
    isOpen: isInviteOpen,
    onOpen: onInviteOpen,
    onClose: onInviteClose,
  } = useDisclosure();
  const handleSelectSlot = (slotInfo: any) => {
    const startDateString = formatDateForInput(slotInfo.start);
    setSelectedDate(startDateString);
    setSelectedEvent(null);
    onEventOpen();
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
    router.push(`/event/${event.id}`);
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    if (invites.length > 0) {
      onInviteOpen();
    }
  }, [invites]);

  return (
    <>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Box
          flex="1"
          width="100%"
          maxW="1500px"
          mx="auto"
          px={{ base: 4, md: 6 }}
          py={4}
        >
          <ReactCalendar
            selectable
            localizer={localizer}
            events={events}
            startAccessor="startDate"
            endAccessor="endDate"
            style={{ height: "82vh", minHeight: "400px", width: "100%" }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            messages={{
              day: "Nap",
              week: "Hét",
              month: "Hónap",
              today: "Ma",
              previous: "Előző",
              next: "Következő",
            }}
            views={{ day: true, week: true, month: true, agenda: false }}
          />
        </Box>
        {isEventOpen && (selectedDate || selectedEvent) && (
          <AddEditEventModal
            isOpen={isEventOpen}
            onClose={onEventClose}
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
      </Box>
      <InviteModal
        isOpen={isInviteOpen}
        onClose={onInviteClose}
        invites={invites}
        acceptInvite={acceptInvite}
        declineInvite={declineInvite}
      />
    </>
  );
};

export default Calendar;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return requireAuth(context);
}
