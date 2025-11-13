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
import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { AirsoftEventType } from "@/shared/enums/AirsoftEventType";
import { useEventStore } from "@/store/eventStore";
import { AirsoftEventsInput } from "@/shared/interfaces/AirsoftEventsInput";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
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
      location: initialData?.location || "",
      maxPlayers: initialData?.maxPlayers || "",
      visibility: initialData?.visibility || "public",
      status: initialData?.status || "open",
      gameType: initialData?.gameType || "",
      price: initialData?.price || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("add item");
      setLoading(true);

      try {
        if (mode === EventModalMode.EDIT) {
          await axios.post("/api/update_event", {});
        } else {
          const addEvent = useEventStore.getState().addEvent;
          addEvent(values);
        }
      } catch (error: any) {
        toast({
          title: error?.response?.data?.event || "Failed to create event",
          isClosable: true,
          duration: 4000,
          status: "error",
        });
      } finally {
        setLoading(false);
        onClose();
      }
    },
  });

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
                  value={formik.values.price}
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
