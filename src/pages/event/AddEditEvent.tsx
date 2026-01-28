import {
  Box,
  Heading,
  Badge,
  Button,
  VStack,
  HStack,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEventStore } from "@/store/eventStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AirsoftEventType } from "@/shared/enums/AirsoftEventType";
import { formatDateForInput } from "@/utils/formatDateForInput";

const AddEditEvent = () => {
  const router = useRouter();
  const toast = useToast();

  const { editingEvent, addEvent, updateEvent } = useEventStore();
  const { clearEditingEvent } = useEventStore((state) => state.editing);

  const isEdit = !!editingEvent?.title;

  const formik = useFormik({
    initialValues: {
      title: editingEvent?.title || "",
      description: editingEvent?.description || "",
      startDate: editingEvent?.startDate || "",
      endDate: editingEvent?.endDate || "",
      location: editingEvent?.location || "",
      maxPlayers: editingEvent?.maxPlayers || "",
      gameType: editingEvent?.gameType || AirsoftEventType.SKIRMISH,
      price: editingEvent?.price || 0,
      visibility: editingEvent?.visibility || "Publikus",
      status: editingEvent?.status || "Nyitott",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Cím megadása kötelező!"),
      description: Yup.string().required("Leírás megadása kötelező!"),
      startDate: Yup.string().required("Kezdő dátum megadása kötelező!"),
      endDate: Yup.string().required("Befejező dáttum megadása kötelező!"),
      location: Yup.string().required("Helyszín megadása kötelező!"),
      maxPlayers: Yup.number()
        .min(1, "Legalább 1 játékos")
        .required("Játékosszám megadása kötelező!"),
      gameType: Yup.string().required("Játék típus megadása kötelező!"),
      price: Yup.number().min(0, "Az ár nem lehet negatív!"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        let savedEvent;
        if (isEdit) {
          if (!editingEvent) return;
          savedEvent = await updateEvent({ id: editingEvent.id, ...values });
          toast({
            title: "Esemény frissítve!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          savedEvent = await addEvent(values);
          toast({
            title: "Esemény létrehozva!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
        clearEditingEvent();
        router.push(`/event/${savedEvent.id}`);
      } catch (error: any) {
        toast({
          title: "Hiba történt",
          description: error?.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    },
  });

  const handleCancel = () => {
    clearEditingEvent();
    router.push("/calendar");
  };

  return (
    <>
      <Header />
      <Box minH="1150px">
        <Box
          maxW="700px"
          mx="auto"
          mt={10}
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <HStack justify="space-between" mb={4}>
            <Heading>
              {isEdit ? "Esemény szerkesztése" : "Esemény létrehozása"}
            </Heading>
            <Badge
              colorScheme={
                formik.values.visibility === "PUBLIC" ? "green" : "red"
              }
            >
              {formik.values.visibility}
            </Badge>
          </HStack>
          <VStack spacing={5} align="stretch">
            <FormControl
              isInvalid={!!formik.errors.title && formik.touched.title}
            >
              <FormLabel>Cím</FormLabel>
              <Input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                !!formik.errors.description && formik.touched.description
              }
            >
              <FormLabel>Leírás</FormLabel>
              <Textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
            </FormControl>
            <HStack spacing={4}>
              <FormControl
                isInvalid={
                  !!formik.errors.startDate && formik.touched.startDate
                }
              >
                <FormLabel>Kezdő dátum</FormLabel>
                <Input
                  type="datetime-local"
                  name="startDate"
                  value={formatDateForInput(formik.values.startDate)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.startDate}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!formik.errors.endDate && formik.touched.endDate}
              >
                <FormLabel>Befejező dátum</FormLabel>
                <Input
                  type="datetime-local"
                  name="endDate"
                  value={formatDateForInput(formik.values.endDate)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.endDate}</FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl
              isInvalid={!!formik.errors.location && formik.touched.location}
            >
              <FormLabel>Helyszín</FormLabel>
              <Input
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.location}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                !!formik.errors.maxPlayers && formik.touched.maxPlayers
              }
            >
              <FormLabel>Max játékosszám</FormLabel>
              <Input
                type="number"
                name="maxPlayers"
                value={formik.values.maxPlayers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.maxPlayers}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!formik.errors.gameType && formik.touched.gameType}
            >
              <FormLabel>Játék típus</FormLabel>
              <Select
                name="gameType"
                value={formik.values.gameType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {Object.values(AirsoftEventType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formik.errors.gameType}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!formik.errors.price && formik.touched.price}
            >
              <FormLabel>Ár (HUF)</FormLabel>
              <Input
                type="number"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                !!formik.errors.visibility && formik.touched.visibility
              }
            >
              <FormLabel>Láthatóság</FormLabel>
              <Select
                name="visibility"
                value={formik.values.visibility}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="PUBLIKUS">PUBLIKUS</option>
                <option value="PRIVÁT">PRIVÁT</option>
              </Select>
              <FormErrorMessage>{formik.errors.visibility}</FormErrorMessage>
            </FormControl>
          </VStack>
          <Divider my={6} />
          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => formik.handleSubmit()}
            >
              {isEdit ? "Mentés" : "Létrehozás"}
            </Button>
            <Button variant="ghost" size="lg" onClick={handleCancel}>
              Mégse
            </Button>
          </HStack>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default AddEditEvent;
