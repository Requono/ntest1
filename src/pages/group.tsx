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
import AddGroupModal from "@/components/CreateGroupModal";

const Group = () => {
  const { groupId, fetchUser } = useUserStore();
  const { fetchGroupMembers, fetchGroupData, members, currentGroup } =
    useGroupStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!groupId) {
        await fetchUser();
      }
      if (groupId) {
        await fetchGroupData(groupId);
        await fetchGroupMembers(groupId);
      }
      setLoading(false);
    };

    load();
  }, [groupId, fetchUser, fetchGroupMembers]);

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
        </Box>
      </Box>
      <Footer />
      {isOpen && <AddGroupModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default Group;
