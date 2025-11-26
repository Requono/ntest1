import { useEffect, useState } from "react";
import { useUserStore } from "@/store/UserStore";
import { useGroupStore } from "@/store/GroupStore";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Divider,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddGroupModal from "@/components/CreateGroupModal";
import { requireAuth } from "@/utils/requireAuth";
import { GetServerSidePropsContext } from "next";

/**TODO:
 * A: group leadernek csoportos jelentkezés eseményre
 * B: csoportból való user eltávolítás
 * C: csoportba való user keresése egy tömbből -> gombra nyomva meghívás -> inviteModal
 * D: esemény keresés -> felső kereső mező kialakítása
 * E: keresés eredménye -> klikk -> event megnyitása
 */

const Group = () => {
  const { userId, groupId, fetchUser } = useUserStore();
  const {
    fetchGroupMembers,
    fetchGroupData,
    members,
    currentGroup,
    fetchUsersWithoutGroup,
    usersWithoutGroup,
    inviteUserToGroup,
  } = useGroupStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [invitedUsers, setInvitedUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const isGroupCreator = currentGroup?.createdById === userId;

  const handleInvite = async (userId: string) => {
    if (!groupId) return;
    try {
      await inviteUserToGroup(userId, groupId);
      setInvitedUsers((prev) => ({ ...prev, [userId]: true }));
    } catch (err) {
      console.error("Failed to invite user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    const load = async () => {
      setLoading(true);
      if (!groupId) {
        await fetchUser();
      }
      if (groupId) {
        await fetchGroupData(groupId);
        await fetchGroupMembers(groupId);
        await fetchUsersWithoutGroup();
      }
      setLoading(false);
    };

    load();
  }, [
    groupId,
    fetchUser,
    fetchGroupMembers,
    fetchGroupData,
    fetchUsersWithoutGroup,
  ]);

  return (
    <>
      <Header />
      <Box minH="1150px">
        <Box
          maxW="600px"
          mx="auto"
          mt={10}
          p={6}
          borderWidth={1}
          borderRadius="md"
        >
          {loading && (
            <Flex justify="center" py={10}>
              <Spinner size="xl" />
            </Flex>
          )}
          {!loading && !groupId && (
            <>
              <Heading mb={4}>No Group Yet</Heading>
              <Text fontSize="lg" mb={6}>
                It seems you are not part of any group yet. You can create your
                own group and invite others!
              </Text>

              <Button colorScheme="blue" width="full" onClick={onOpen}>
                Create Group
              </Button>
            </>
          )}
          {!loading && groupId && (
            <>
              <Heading mb={4}>Your Group Members</Heading>
              <Text mb={4} fontSize="md" color="gray.600">
                Here's your team: <b>{currentGroup?.name}</b>
              </Text>

              <Divider mb={4} />

              {members.length === 0 && (
                <Text>No members found in this group yet.</Text>
              )}
              <VStack align="stretch" spacing={3}>
                {members.map((member) => (
                  <Box
                    key={member.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    bg="gray.50"
                  >
                    <Text fontWeight="bold">{member.username}</Text>
                  </Box>
                ))}
              </VStack>
            </>
          )}
          {!loading && groupId && members.length < 5 && isGroupCreator && (
            <Box p={6} borderWidth={1} borderRadius="md" mt={2}>
              <Heading mb={4}>Suggestions to Fill Your Team</Heading>
              <Text fontSize="md" mb={4}>
                Until you have 5 members, here are some users without a group:
              </Text>
              <VStack align="stretch" spacing={3}>
                {usersWithoutGroup.length === 0 && (
                  <Text>No users available.</Text>
                )}
                {usersWithoutGroup.map((user) => (
                  <Flex
                    key={user.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    bg="gray.50"
                    justify="space-between"
                    align="center"
                  >
                    <Text fontWeight="bold">{user.username}</Text>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleInvite(user.id)}
                      isDisabled={!!invitedUsers[user.id] || !groupId}
                    >
                      {invitedUsers[user.id] ? "Invited" : "Invite"}
                    </Button>
                  </Flex>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </Box>
      <Footer />
      {isOpen && <AddGroupModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default Group;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return requireAuth(context);
}
