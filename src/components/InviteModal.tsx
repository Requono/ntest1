import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  VStack,
  Text,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";

interface Invite {
  id: string;
  group: {
    id: string;
    name: string;
  };
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  invites: Invite[];
  acceptInvite: (inviteId: string) => Promise<void> | void;
  declineInvite: (inviteId: string) => Promise<void> | void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  invites,
  acceptInvite,
  declineInvite,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Group Invitations</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {invites.map((invite) => (
              <Box key={invite.id} p={4} borderWidth={1} borderRadius="md">
                <Text mb={2}>
                  You have been invited to join: <b>{invite.group.name}</b>
                </Text>
                <Button
                  colorScheme="blue"
                  mr={2}
                  onClick={() => acceptInvite(invite.id)}
                >
                  Accept
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => declineInvite(invite.id)}
                >
                  Decline
                </Button>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
