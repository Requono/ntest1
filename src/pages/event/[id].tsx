import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { requireAuth } from "@/utils/requireAuth";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEventStore } from "@/store/eventStore";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserStore } from "@/store/userStore";
import { useGroupStore } from "@/store/groupStore";
import JoinEventAsGroupModal from "@/components/JoinEventAsGroupModal";

const EventPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { currentEvent, fetchEvent, joinEvent, joinGroupEvent, leaveEvent } =
    useEventStore();
  const { userId } = useUserStore();
  const { currentGroup, members } = useGroupStore();
  const isGroupCreator = currentGroup?.createdById === userId;
  const [loading, setLoading] = useState(true);
  const {
    isOpen: isGroupModalOpen,
    onOpen: onGroupModalOpen,
    onClose: onGroupModalClose,
  } = useDisclosure();

  const isJoined = currentEvent?.users?.some((u) => u.userId === userId);
  const registeredPlayers = currentEvent?.users?.length || 0;
  const maxPlayers = Number(currentEvent?.maxPlayers) || 0;
  const maxPlayersText = `${registeredPlayers}/${maxPlayers}`;
  const shouldRegisteringBeEnabled = registeredPlayers === maxPlayers;

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchEvent(id).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Betöltés...</div>;
  if (!currentEvent) return <div>Esemény nem található.</div>;

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
          <Heading mb={3}>{currentEvent.title}</Heading>
          <Badge
            colorScheme={currentEvent.visibility === "PUBLIC" ? "green" : "red"}
            mb={4}
          >
            {currentEvent.visibility}
          </Badge>
          <Text fontSize="lg" fontWeight="medium" mb={2}>
            <b>Helyszín:</b> {currentEvent.location}
          </Text>
          <Text color="gray.600" mb={4}>
            <b>Leírás:</b> {currentEvent.description}
          </Text>
          <Divider mb={4} />
          <VStack align="start" spacing={2}>
            <Text>
              <b>Start:</b> {new Date(currentEvent.startDate).toLocaleString()}
            </Text>
            <Text>
              <b>Vége:</b> {new Date(currentEvent.endDate).toLocaleString()}
            </Text>
            <Text>
              <b>Max játékosok:</b> {maxPlayersText}
            </Text>
            <Text>
              <b>Játék típus:</b> {currentEvent.gameType}
            </Text>
            <Text>
              <b>Ár:</b> {currentEvent.price} HUF
            </Text>
            <Text>
              <b>Státusz:</b> {currentEvent.status}
            </Text>
          </VStack>
          <Divider my={6} />
          <HStack spacing={4}>
            {!isJoined ? (
              <Box style={{ display: "flex", gap: "1rem" }}>
                <Button
                  colorScheme="green"
                  size="lg"
                  onClick={() => {
                    joinEvent(currentEvent.id);
                    router.push("/Calendar");
                  }}
                  isDisabled={shouldRegisteringBeEnabled}
                >
                  Regisztráció egyedül
                </Button>
                {isGroupCreator && (
                  <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={onGroupModalOpen}
                    isDisabled={shouldRegisteringBeEnabled}
                  >
                    Csoportos regisztráció
                  </Button>
                )}
              </Box>
            ) : (
              <Button
                colorScheme="red"
                size="lg"
                onClick={() => {
                  leaveEvent(currentEvent.id);
                  router.push("/Calendar");
                }}
              >
                Lejelentkezés
              </Button>
            )}
          </HStack>
          <Box mt={6}>
            <Button variant="ghost" onClick={() => router.push("/Calendar")}>
              Vissza a Kalendárhoz
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
      <JoinEventAsGroupModal
        isOpen={isGroupModalOpen}
        onClose={onGroupModalClose}
        members={members || []}
        onSubmit={(userIds: string[]) => {
          joinGroupEvent(currentEvent.id, userIds);
          router.push("/Calendar");
        }}
      />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return requireAuth(context);
}

export default EventPage;
