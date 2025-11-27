import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  CheckboxGroup,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface JoinEventAsGroupModal {
  isOpen: boolean;
  onClose: () => void;
  members: { id: string; username: string }[];
  onSubmit: (userIds: string[]) => Promise<void> | void;
}

const JoinEventAsGroupModal: React.FC<JoinEventAsGroupModal> = ({
  isOpen,
  onClose,
  members,
  onSubmit,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) setSelectedUsers([]);
  }, [isOpen]);

  const handleSelectAll = () => {
    if (selectedUsers.length === members.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(members.map((m) => m.id));
    }
  };

  const isAllSelected = selectedUsers.length === members.length;

  const handleSubmit = () => {
    onSubmit(selectedUsers);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Válaszd ki a csoporttagokat</ModalHeader>
        <ModalBody>
          <HStack justify="flex-end" mb={3}>
            <Button size="sm" onClick={handleSelectAll}>
              {isAllSelected ? "Összes törlése" : "Összes kijelölése"}
            </Button>
          </HStack>

          <CheckboxGroup
            value={selectedUsers}
            onChange={(value) => setSelectedUsers(value as string[])}
          >
            <VStack align="start" spacing={2}>
              {members.map((member) => (
                <Checkbox key={member.id} value={member.id}>
                  {member.username}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Mégse
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleSubmit}
            isDisabled={selectedUsers.length === 0}
          >
            Regisztráció befejezése
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinEventAsGroupModal;
