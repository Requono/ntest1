import { EventModalMode } from "@/enums/EventModalMode";
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
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Image } from "@chakra-ui/react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  mode: EventModalMode;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    maxPlayers: "",
    visibility: "public",
    status: "open",
    gameType: "",
    price: "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        location: initialData.location ?? "",
        maxPlayers: initialData.maxPlayers ?? "",
        visibility: initialData.visibility ?? "public",
        status: initialData.status ?? "open",
        gameType: initialData.gameType ?? "",
        price: initialData.price ?? "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate) : null,
      endDate: form.endDate ? new Date(form.endDate) : null,
      maxPlayers: form.maxPlayers ? Number(form.maxPlayers) : null,
      price: form.price ? Number(form.price) : null,
    };
    onSubmit(dataToSubmit);
    onClose();
  };

  const title = mode === EventModalMode.ADD ? "Add event" : "Edit event";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <Image alt="fasz" src={""} />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing="4" align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Event title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the event..."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Szegedi Airsoft Field"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="datetime-local"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="datetime-local"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Max Players</FormLabel>
                <Input
                  type="number"
                  name="maxPlayers"
                  value={form.maxPlayers}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Visibility</FormLabel>
                <Select
                  name="visibility"
                  value={form.visibility}
                  onChange={handleChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
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
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="larp">LARP</option>
                  <option value="milsim">MilSim</option>
                  <option value="cqb">CQB</option>
                  <option value="speedsoft">SpeedSoft</option>
                  <option value="skirmish">Skirmish</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Price (HUF)</FormLabel>
                <Input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="solid" colorScheme="blue" type="submit">
              Add Event
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddEventModal;
