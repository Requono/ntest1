import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useGroupStore } from "@/store/groupStore";
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
import CreateGroupModal from "@/components/CreateGroupModal";
import { requireAuth } from "@/utils/requireAuth";
import { GetServerSidePropsContext } from "next";
import GroupUserSearchBar from "@/components/GroupUserSearchBar";

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
      console.error("Felhasználó meghívása sikertelen:", err);
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
                <Heading mb={4}>Nincs csoportod</Heading>
                <Text fontSize="lg" mb={6}>
                  Úgy néz ki még nincs csoportod. Létrehozhatod a sajátodat és
                  meghívhatsz másokat!
                </Text>

                <Button colorScheme="blue" width="full" onClick={onOpen}>
                  Csoport létrehozása
                </Button>
              </>
            )}
            {!loading && groupId && (
              <>
                <Heading mb={4}>Saját csoportod</Heading>
                <Text mb={4} fontSize="md" color="gray.600">
                  A csapatod: <b>{currentGroup?.name}</b>
                </Text>

                <Divider mb={4} />

                {members.length === 0 && (
                  <Text>Csoporttagok nem találhatóak.</Text>
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
                          Eltávolítás
                        </Button>
                      )}
                    </Flex>
                  ))}
                </VStack>
              </>
            )}
            {!loading && groupId && members.length < 5 && isGroupCreator && (
              <Box p={6} borderWidth={1} borderRadius="md" mt={2}>
                <Heading mb={4}>Ajánlások</Heading>
                <Text fontSize="md" mb={4}>
                  Ameddig nincs 5 csoporttagod, itt van pár ajánlás:
                </Text>
                <VStack align="stretch" spacing={3}>
                  {usersWithoutGroup.length === 0 && (
                    <Text>Nem találhatóak felhasználók</Text>
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
                        {invitedUsers[user.id] ? "Meghívva" : "Meghívás"}
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
      {isOpen && <CreateGroupModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default Group;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return requireAuth(context);
}
