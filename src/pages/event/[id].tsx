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
import { useEventStore } from "@/store/EventStore";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserStore } from "@/store/UserStore";
import { useGroupStore } from "@/store/GroupStore";
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

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchEvent(id).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!currentEvent) return <div>Event not found.</div>;

  return (
    <>
      <Header />
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
          <b>Location:</b> {currentEvent.location}
        </Text>
        <Text color="gray.600" mb={4}>
          <b>Description:</b> {currentEvent.description}
        </Text>
        <Divider mb={4} />
        <VStack align="start" spacing={2}>
          <Text>
            <b>Start:</b> {new Date(currentEvent.startDate).toLocaleString()}
          </Text>
          <Text>
            <b>End:</b> {new Date(currentEvent.endDate).toLocaleString()}
          </Text>
          <Text>
            <b>Max Players:</b>{" "}
            {
              currentEvent.maxPlayers /**TODO: itt az eddigi regisztráltak / max player lesz majd */
            }
          </Text>
          <Text>
            <b>Game Type:</b> {currentEvent.gameType}
          </Text>
          <Text>
            <b>Price:</b> {currentEvent.price} HUF
          </Text>
          <Text>
            <b>Status:</b> {currentEvent.status}
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
              >
                Register Solo
              </Button>
              {isGroupCreator && (
                <Button colorScheme="teal" size="lg" onClick={onGroupModalOpen}>
                  Register Group
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
              Leave Event
            </Button>
          )}
        </HStack>
        <Box mt={6}>
          <Button variant="ghost" onClick={() => router.push("/Calendar")}>
            Back to Calendar
          </Button>
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
