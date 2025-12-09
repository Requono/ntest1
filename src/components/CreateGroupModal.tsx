import {
  Box,
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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useFormik } from "formik";
import { useGroupStore } from "@/store/GroupStore";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const { createGroup } = useGroupStore();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createGroup(values.name);

        toast({
          title: "Csoport sikeresen létrehozva!",
          isClosable: true,
          duration: 4000,
          status: "success",
        });

        onClose();
      } catch (error: any) {
        toast({
          title:
            error?.response?.data?.message ||
            "Hiba történt a csoport létrehozása során",
          isClosable: true,
          duration: 4000,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <ModalHeader>Csoport létrehozása</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing="4" align="stretch">
              <FormControl isRequired>
                <FormLabel>Csoport neve</FormLabel>
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder="Csoport neve"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Mégse
            </Button>

            <Button
              variant="solid"
              colorScheme="blue"
              type="submit"
              isLoading={loading}
            >
              Létrehozás
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateGroupModal;
