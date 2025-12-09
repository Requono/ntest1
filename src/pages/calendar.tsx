import { Calendar as ReactCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import InviteModal from "../components/InviteModal";
import { Box, useDisclosure } from "@chakra-ui/react";
import { useEventStore } from "@/store/eventStore";
import Header from "@/components/Header";
import { formatDateForInput } from "@/utils/formatDateForInput";
import Footer from "@/components/Footer";
import { useUserStore } from "@/store/userStore";
import { requireAuth } from "@/utils/requireAuth";
import { GetServerSidePropsContext } from "next";
import EventActionDialog from "@/components/EventActionDialog";
require("moment/locale/hu.js");

const Calendar = () => {
  const localizer = momentLocalizer(moment);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const {
    groupId,
    invites,
    fetchUser,
    fetchInvites,
    acceptInvite,
    declineInvite,
  } = useUserStore();
  const { events, fetchEvents } = useEventStore();
  const {
    isOpen: isInviteOpen,
    onOpen: onInviteOpen,
    onClose: onInviteClose,
  } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const [userLoaded, setUserLoaded] = useState(false);

  const handleSelectSlot = (slotInfo: any) => {
    const startDateString = formatDateForInput(slotInfo.start);
    const endDateString = formatDateForInput(slotInfo.end);
    setSelectedStartDate(startDateString);
    setSelectedEndDate(endDateString);
    setSelectedEvent(null);
    onDialogOpen();
  };
  const handleSelectEvent = (event: any) => {
    const startDateString = formatDateForInput(event.startDate);
    const endDateString = formatDateForInput(event.endDate);
    setSelectedStartDate("");
    setSelectedEvent({
      ...event,
      startDate: startDateString,
      endDate: endDateString,
    });
    onDialogOpen();
  };

  useEffect(() => {
    const loadUser = async () => {
      await fetchUser();
      setUserLoaded(true);
    };
    loadUser();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    if (userLoaded && invites.length > 0 && !groupId) {
      onInviteOpen();
    }
  }, [invites, groupId]);

  /** TODO:
   * eventPropGetter={(event) => {
    const backgroundColor = event.allday ? 'yellow' : 'blue';
    return { style: { backgroundColor } }
  }}
  ezzel lehet majd változtatni az event színét attól függően h regisztrált-e a user rá -> BIG
*/

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
        <Footer />
      </Box>
      <InviteModal
        isOpen={isInviteOpen}
        onClose={onInviteClose}
        invites={invites}
        acceptInvite={acceptInvite}
        declineInvite={declineInvite}
      />
      <EventActionDialog
        isOpen={isDialogOpen}
        onClose={onDialogClose}
        selectedEvent={selectedEvent}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
      />
    </>
  );
};

export default Calendar;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return requireAuth(context);
}
