import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  Button,
  useOutsideClick,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useRef } from "react";

interface GroupUserSearchProps {
  query: string;
  setQuery: (value: string) => void;
  isDropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  users: { id: string; username: string; email: string }[];
  handleInvite: (userId: string) => void;
}

const GroupUserSearch: React.FC<GroupUserSearchProps> = ({
  query,
  setQuery,
  isDropdownOpen,
  setDropdownOpen,
  users,
  handleInvite,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: containerRef,
    handler: () => setDropdownOpen(false),
  });

  return (
    <Box position="relative" w="550px" display="flex" flexDirection="column">
      <Text mb={2} fontSize="m" color="gray.600">
        Keress a csoportodba embereket, és hívd meg őket!
      </Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.200" />
        </InputLeftElement>
        <Input
          placeholder="Felhasználó meghívása..."
          bg="white"
          color="black"
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            setDropdownOpen(value.trim().length > 0);
          }}
          borderRadius="md"
        />
      </InputGroup>

      {isDropdownOpen && users.length > 0 && (
        <Box
          position="absolute"
          top="75px"
          left={0}
          right={0}
          bg="white"
          color="black"
          borderRadius="md"
          boxShadow="lg"
          maxH="300px"
          overflowY="auto"
          zIndex={3000}
        >
          <VStack align="stretch" spacing={0}>
            {users.map((user) => (
              <Box
                key={user.id}
                px={4}
                py={3}
                borderBottom="1px solid #eee"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
              >
                <Text fontWeight="bold">{user.username}</Text>
                <Text fontSize="sm" color="gray.600">
                  {user.email}
                </Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  mt={2}
                  onClick={() => handleInvite(user.id)}
                >
                  Meghívás csoportba
                </Button>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default GroupUserSearch;
