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
import GroupUserSearchBar from "@/components/GroupUserSearchBar";

/**TODO:
 * A: magyarosítás
 * B: UI felcsinosítása
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
    removeUserFromGroup,
  } = useGroupStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [invitedUsers, setInvitedUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const isGroupCreator = currentGroup?.createdById === userId;

  const [query, setQuery] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const filteredUsers = usersWithoutGroup.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        gap={6}
        mt={10}
        minH="1150px"
        px={4}
      >
        <>
          <Box maxW="600px" w="100%" p={6} borderWidth={1} borderRadius="md">
            {loading && (
              <Flex justify="center" py={10}>
                <Spinner size="xl" />
              </Flex>
            )}
            {!loading && !groupId && (
              <>
                <Heading mb={4}>No Group Yet</Heading>
                <Text fontSize="lg" mb={6}>
                  It seems you are not part of any group yet. You can create
                  your own group and invite others!
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
                    <Flex
                      key={member.id}
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      bg="gray.50"
                      justify="space-between"
                      align="center"
                    >
                      <Text fontWeight="bold">{member.username}</Text>

                      {isGroupCreator && member.id !== userId && (
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() =>
                            removeUserFromGroup(member.id, currentGroup!.id)
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </Flex>
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
          {isGroupCreator && (
            <Box maxW="400px" w="100%">
              <GroupUserSearchBar
                query={query}
                setQuery={setQuery}
                isDropdownOpen={isDropdownOpen}
                setDropdownOpen={setDropdownOpen}
                users={filteredUsers}
                handleInvite={(userId) => handleInvite(userId)}
              />
            </Box>
          )}
        </>
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
