import { EventModalMode } from "@/shared/enums/EventModalMode";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { AirsoftEventType } from "@/shared/enums/AirsoftEventType";
import { useEventStore } from "@/store/eventStore";
import {
  AirsoftEvents,
  AirsoftEventsInput,
} from "@/shared/interfaces/AirsoftEventsInput";
import { useUserStore } from "@/store/userStore";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AirsoftEvents;
  mode: EventModalMode;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  initialData,
  mode,
}) => {
  const [loading, setLoading] = useState(false);
  const title = mode === EventModalMode.ADD ? "Add event" : "Edit event";
  const toast = useToast();
  const formatDateForInput = (date?: string | Date) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    const iso = d.toISOString();
    return iso.substring(0, 16);
  };

  const formik = useFormik<AirsoftEventsInput>({
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      location: initialData?.location || "", //TODO: google térkép embed maybe
      maxPlayers: initialData?.maxPlayers || "",
      visibility: initialData?.visibility || "public",
      status: initialData?.status || "open",
      gameType: initialData?.gameType || AirsoftEventType.SKIRMISH,
      price: initialData?.price || 0,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (mode === EventModalMode.EDIT) {
          if (!initialData) return;
          const updateEvent = useEventStore.getState().updateEvent;
          updateEvent({ id: initialData.id, ...values });
        } else {
          const addEvent = useEventStore.getState().addEvent;
          addEvent(values);
        }
      } catch (error: any) {
        toast({
          title: error?.response?.data?.event || "Error while processing event",
          isClosable: true,
          duration: 4000,
          status: "error",
        });
      } finally {
        toast({
          title:
            mode === EventModalMode.EDIT
              ? "Event changed successfully!"
              : "Event added successfully!",
          isClosable: true,
          duration: 4000,
          status: "success",
        });
        setLoading(false);
        onClose();
      }
    },
  });

  const userId = useUserStore.getState().getUserId();
  useEffect(() => {
    if (!userId) return;
  }, [userId]);

  const handleDeleteEvent = (eventId: string) => {
    try {
      const deleteEvent = useEventStore.getState().deleteEvent;
      deleteEvent(eventId);
    } catch (error: any) {
      toast({
        title: error?.response?.data || "Error while deleting event",
        isClosable: true,
        duration: 4000,
        status: "error",
      });
    } finally {
      toast({
        title: "Event deleted successfully!",
        isClosable: true,
        duration: 4000,
        status: "success",
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing="4" align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  placeholder="Event title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  placeholder="Describe the event..."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  placeholder="e.g. Szegedi Airsoft Field"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="datetime-local"
                  name="startDate"
                  value={formatDateForInput(formik.values.startDate)}
                  onChange={formik.handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="datetime-local"
                  name="endDate"
                  value={formatDateForInput(formik.values.endDate)}
                  onChange={formik.handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Max Players</FormLabel>
                <Input
                  type="number"
                  name="maxPlayers"
                  value={formik.values.maxPlayers}
                  onChange={formik.handleChange}
                  placeholder="e.g. 60"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Visibility</FormLabel>
                <Select
                  name="visibility"
                  value={formik.values.visibility}
                  onChange={formik.handleChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Game Type</FormLabel>
                <Select
                  name="gameType"
                  value={formik.values.gameType}
                  onChange={formik.handleChange}
                >
                  {Object.values(AirsoftEventType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price (HUF)</FormLabel>
                <Input
                  type="number"
                  name="price"
                  value={Number(formik.values.price)}
                  onChange={formik.handleChange}
                  placeholder="e.g. 2000"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            {initialData?.createdById === userId && (
              <Button
                mr={3}
                variant="solid"
                colorScheme="red"
                onClick={() => handleDeleteEvent(initialData?.id)}
              >
                Delete event
              </Button>
            )}
            <Button
              variant="solid"
              colorScheme="blue"
              type="submit"
              isLoading={loading}
            >
              {mode === EventModalMode.EDIT ? "Edit event" : "Add event"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddEventModal;
