import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useRouter } from "next/router";
import { useEventStore } from "@/store/EventStore";
import { useUserStore } from "@/store/UserStore";

interface EventActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent?: any;
  selectedStartDate?: string;
  selectedEndDate?: string;
}

const EventActionDialog: React.FC<EventActionDialogProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  selectedStartDate,
  selectedEndDate,
}: any) => {
  const cancelRef = useRef(null);
  const router = useRouter();
  const { setEditingEvent } = useEventStore((state) => state.editing);
  const { userId } = useUserStore();

  const isEventSelected = !!selectedEvent;
  const isNewEvent = !selectedEvent;
  const canEditEvent = userId === selectedEvent?.createdById;

  const handleOpen = () => {
    onClose();
    router.push(`/event/${selectedEvent.id}`);
  };

  const handleAddEdit = () => {
    const initialData =
      selectedEvent ??
      (selectedStartDate
        ? { startDate: selectedStartDate, endDate: selectedEndDate || "" }
        : undefined);
    setEditingEvent(initialData);
    onClose();
    router.push(`/event/AddEditEvent`);
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Esemény opciói
          </AlertDialogHeader>
          <AlertDialogBody>
            {isEventSelected
              ? "Mit szeretnél tenni az eseménnyel?"
              : "Szeretnél létrehozni egy eseményt?"}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Stack direction="row" spacing={4}>
              <Button ref={cancelRef} onClick={onClose}>
                Mégse
              </Button>
              {isEventSelected && (
                <>
                  <Button colorScheme="blue" onClick={handleOpen}>
                    Megnyitás
                  </Button>
                  {canEditEvent && (
                    <Button colorScheme="green" onClick={handleAddEdit}>
                      Szerkesztés
                    </Button>
                  )}
                </>
              )}
              {isNewEvent && (
                <Button colorScheme="green" onClick={handleAddEdit}>
                  Új esemény
                </Button>
              )}
            </Stack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default EventActionDialog;
